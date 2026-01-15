import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';

const router = Router();

// GET /api/members - メンバー一覧（グループフィルター、ソート）
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = '1',
      limit = '50',
      groupId,
      status,
      sort = 'displayOrder',
      order = 'asc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status as string;
    }

    if (groupId) {
      where.memberGroupHistory = {
        some: {
          groupId: parseInt(groupId as string, 10),
          isCurrent: true,
        },
      };
    }

    // Build orderBy clause
    const validSortFields = ['displayOrder', 'name', 'nameKana', 'birthDate', 'joinDate'];
    const sortField = validSortFields.includes(sort as string) ? (sort as string) : 'displayOrder';
    const sortOrder = order === 'desc' ? 'desc' : 'asc';

    // Get total count and members
    const [total, members] = await Promise.all([
      prisma.member.count({ where }),
      prisma.member.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortField]: sortOrder },
        include: {
          memberGroupHistory: {
            where: { isCurrent: true },
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
        },
      }),
    ]);

    // Transform response
    const transformedMembers = members.map((member) => ({
      ...member,
      currentGroups: member.memberGroupHistory.map((mgh) => ({
        ...mgh.group,
        position: mgh.position,
        joinDate: mgh.joinDate,
      })),
      memberGroupHistory: undefined,
    }));

    res.json({
      success: true,
      data: transformedMembers,
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

// GET /api/members/:id - メンバー詳細
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Support both numeric ID and slug
    const where = /^\d+$/.test(id) ? { id: parseInt(id, 10) } : { slug: id };

    const member = await prisma.member.findUnique({
      where,
      include: {
        memberGroupHistory: {
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
          orderBy: { joinDate: 'desc' },
        },
        newsMembers: {
          include: {
            news: {
              select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                thumbnailUrl: true,
                publishedAt: true,
              },
            },
          },
          take: 10,
          orderBy: { news: { publishedAt: 'desc' } },
        },
        eventMembers: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                slug: true,
                eventType: true,
                startDatetime: true,
                venueName: true,
              },
            },
          },
          take: 10,
          orderBy: { event: { startDatetime: 'desc' } },
        },
      },
    });

    if (!member) {
      throw new NotFoundError('Member');
    }

    // Transform response
    const transformedMember = {
      ...member,
      groupHistory: member.memberGroupHistory.map((mgh) => ({
        group: mgh.group,
        position: mgh.position,
        joinDate: mgh.joinDate,
        leaveDate: mgh.leaveDate,
        isCurrent: mgh.isCurrent,
      })),
      currentGroups: member.memberGroupHistory
        .filter((mgh) => mgh.isCurrent)
        .map((mgh) => ({
          ...mgh.group,
          position: mgh.position,
        })),
      recentNews: member.newsMembers.map((nm) => nm.news),
      upcomingEvents: member.eventMembers.map((em) => em.event),
      memberGroupHistory: undefined,
      newsMembers: undefined,
      eventMembers: undefined,
    };

    res.json({
      success: true,
      data: transformedMember,
    });
  })
);

export default router;
