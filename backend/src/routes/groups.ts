import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';

const router = Router();

// GET /api/groups - グループ一覧（ステータスフィルター）
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      status,
      sort = 'displayOrder',
      order = 'asc',
    } = req.query;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status as string;
    }

    // Build orderBy clause
    const validSortFields = ['displayOrder', 'name', 'foundedDate'];
    const sortField = validSortFields.includes(sort as string) ? (sort as string) : 'displayOrder';
    const sortOrder = order === 'desc' ? 'desc' : 'asc';

    const groups = await prisma.group.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
      include: {
        _count: {
          select: {
            memberGroupHistory: {
              where: { isCurrent: true },
            },
          },
        },
      },
    });

    // Transform response
    const transformedGroups = groups.map((group) => ({
      ...group,
      memberCount: group._count.memberGroupHistory,
      _count: undefined,
    }));

    res.json({
      success: true,
      data: transformedGroups,
    });
  })
);

// GET /api/groups/:id - グループ詳細（メンバー情報含む）
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Support both numeric ID and slug
    const where = /^\d+$/.test(id) ? { id: parseInt(id, 10) } : { slug: id };

    const group = await prisma.group.findUnique({
      where,
      include: {
        memberGroupHistory: {
          where: { isCurrent: true },
          include: {
            member: {
              select: {
                id: true,
                name: true,
                nameKana: true,
                slug: true,
                nickname: true,
                birthDate: true,
                profileImageUrl: true,
                memberColor: true,
                status: true,
                displayOrder: true,
              },
            },
          },
          orderBy: { member: { displayOrder: 'asc' } },
        },
        newsGroups: {
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
        eventGroups: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                slug: true,
                eventType: true,
                startDatetime: true,
                venueName: true,
                isCancelled: true,
              },
            },
          },
          take: 10,
          orderBy: { event: { startDatetime: 'desc' } },
        },
        discographies: {
          take: 10,
          orderBy: { releaseDate: 'desc' },
          select: {
            id: true,
            title: true,
            slug: true,
            releaseType: true,
            releaseDate: true,
            coverImageUrl: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundError('Group');
    }

    // Transform response
    const transformedGroup = {
      ...group,
      members: group.memberGroupHistory.map((mgh) => ({
        ...mgh.member,
        position: mgh.position,
        joinDate: mgh.joinDate,
      })),
      recentNews: group.newsGroups.map((ng) => ng.news),
      upcomingEvents: group.eventGroups.map((eg) => eg.event),
      memberGroupHistory: undefined,
      newsGroups: undefined,
      eventGroups: undefined,
    };

    res.json({
      success: true,
      data: transformedGroup,
    });
  })
);

export default router;
