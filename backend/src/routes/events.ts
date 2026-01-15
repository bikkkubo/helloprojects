import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { asyncHandler, NotFoundError, BadRequestError } from '../middleware/errorHandler';

const router = Router();

// GET /api/events - イベント一覧（期間、グループフィルター）
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = '1',
      limit = '20',
      groupId,
      eventType,
      startDate,
      endDate,
      upcoming,
      includeCancelled = 'false',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    // Filter by cancelled status
    if (includeCancelled !== 'true') {
      where.isCancelled = false;
    }

    // Filter by event type
    if (eventType) {
      where.eventType = eventType as string;
    }

    // Filter by group
    if (groupId) {
      where.eventGroups = {
        some: {
          groupId: parseInt(groupId as string, 10),
        },
      };
    }

    // Filter by date range
    if (startDate || endDate) {
      where.startDatetime = {};
      if (startDate) {
        const start = new Date(startDate as string);
        if (isNaN(start.getTime())) {
          throw new BadRequestError('Invalid startDate format');
        }
        where.startDatetime.gte = start;
      }
      if (endDate) {
        const end = new Date(endDate as string);
        if (isNaN(end.getTime())) {
          throw new BadRequestError('Invalid endDate format');
        }
        where.startDatetime.lte = end;
      }
    }

    // Filter for upcoming events only
    if (upcoming === 'true') {
      where.startDatetime = {
        ...where.startDatetime,
        gte: new Date(),
      };
    }

    // Determine sort order
    const orderDirection = upcoming === 'true' ? 'asc' : 'desc';

    // Get total count and events
    const [total, events] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { startDatetime: orderDirection },
        include: {
          eventGroups: {
            include: {
              group: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  colorCode: true,
                },
              },
            },
          },
          eventMembers: {
            include: {
              member: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  profileImageUrl: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Transform response
    const transformedEvents = events.map((event) => ({
      ...event,
      groups: event.eventGroups.map((eg) => eg.group),
      members: event.eventMembers.map((em) => em.member),
      eventGroups: undefined,
      eventMembers: undefined,
    }));

    res.json({
      success: true,
      data: transformedEvents,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    });
  })
);

// GET /api/events/:id - イベント詳細
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Support both numeric ID and slug
    const where = /^\d+$/.test(id) ? { id: parseInt(id, 10) } : { slug: id };

    const event = await prisma.event.findUnique({
      where,
      include: {
        eventGroups: {
          include: {
            group: {
              select: {
                id: true,
                name: true,
                slug: true,
                colorCode: true,
                imageUrl: true,
              },
            },
          },
        },
        eventMembers: {
          include: {
            member: {
              select: {
                id: true,
                name: true,
                slug: true,
                profileImageUrl: true,
                memberColor: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundError('Event');
    }

    // Transform response
    const transformedEvent = {
      ...event,
      groups: event.eventGroups.map((eg) => eg.group),
      members: event.eventMembers.map((em) => em.member),
      eventGroups: undefined,
      eventMembers: undefined,
    };

    res.json({
      success: true,
      data: transformedEvent,
    });
  })
);

export default router;
