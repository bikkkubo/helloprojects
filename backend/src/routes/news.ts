import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';

const router = Router();

// GET /api/news - ニュース一覧（ページネーション、カテゴリ・グループフィルター）
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = '1',
      limit = '20',
      category,
      groupId,
      featured,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    if (category) {
      where.category = category as string;
    }

    if (groupId) {
      where.newsGroups = {
        some: {
          groupId: parseInt(groupId as string, 10),
        },
      };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Get total count and news items
    const [total, news] = await Promise.all([
      prisma.news.count({ where }),
      prisma.news.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { publishedAt: 'desc' },
        include: {
          newsGroups: {
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
          newsMembers: {
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
    const transformedNews = news.map((item) => ({
      ...item,
      groups: item.newsGroups.map((ng) => ng.group),
      members: item.newsMembers.map((nm) => nm.member),
      newsGroups: undefined,
      newsMembers: undefined,
    }));

    res.json({
      success: true,
      data: transformedNews,
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

// GET /api/news/:id - ニュース詳細
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Support both numeric ID and slug
    const where = /^\d+$/.test(id) ? { id: parseInt(id, 10) } : { slug: id };

    const news = await prisma.news.findUnique({
      where,
      include: {
        newsGroups: {
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
        newsMembers: {
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
    });

    if (!news) {
      throw new NotFoundError('News');
    }

    // Increment view count (fire and forget)
    prisma.news.update({
      where: { id: news.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    // Transform response
    const transformedNews = {
      ...news,
      groups: news.newsGroups.map((ng) => ng.group),
      members: news.newsMembers.map((nm) => nm.member),
      newsGroups: undefined,
      newsMembers: undefined,
    };

    res.json({
      success: true,
      data: transformedNews,
    });
  })
);

export default router;
