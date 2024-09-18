// import { IActivityLog } from '../../domain/entities/ActivityLog';
// import ActivityLogModel from '../../domain/entities/ActivityLog';
// import logger from '../../infrastructure/logging/Logger';
// // import ActivityLogRepository from '../../infrastructure/databases/MongoActivityLogRepo';
// import ActivityLogController from '../../presentation/controllers/ActivityLogController';
// import { Types } from 'mongoose';

// // Mocking the dependencies
// jest.mock('../../domain/entities/ActivityLog');
// const request:any extends Request = {
//     body: {
//     userId: new Types.ObjectId("66eb2c1e3d09ea6d0f41e6be"),
//     method: 'POST',
//     route: '/api/products',
//     statusCode: 201,
//     responseTime: '100ms',
//     timestamp: new Date(),
//     ip: '192.168.1.1',
//     }
// }
// const response = {
//     status: jest.fn((x)=> ({
//         x,
//         json: jest.fn((y)=> y)
//     }))
// }
// const activityLogController:ActivityLogController = new ActivityLogController();
// jest.mock('../../domain/entities/ActivityLog', () => {
//   const mockSave = jest.fn();
//   const mockFind = jest.fn(); // Mock the static find method
//   return {
//     __esModule: true,
//     default: jest.fn().mockImplementation(function (this: any) {
//       this.save = mockSave;
//       return this;
//     }),
//     find: mockFind, // Add the find method to the mock
//   };
// });

// jest.mock('../../infrastructure/logging/Logger', () => ({
//   info: jest.fn(),
//   error: jest.fn(),
// }));

// describe('ActivityLogController', () => {
// it('should create and return a new activity log entry successfully', async () => {})
// activityLogController.createActivityLog(request, response);
// })
import { Request, Response } from 'express';
import ActivityLogController from '../../presentation/controllers/ActivityLogController';
import ActivityLogRepository from '../../infrastructure/databases/MongoActivityLogRepo';
import Logger from '../../infrastructure/logging/Logger';
import { Types } from 'mongoose';

// Mock dependencies
jest.mock('../../infrastructure/databases/MongoActivityLogRepo');
jest.mock('../../infrastructure/logging/Logger');
const mockActivityData = {
    userId: new Types.ObjectId("66eb2c1e3d09ea6d0f41e6be"),
    method: 'POST',
    route: '/api/products',
    statusCode: 201,
    responseTime: '100ms',
    timestamp: new Date(),
    ip: '192.168.1.1',
    }
describe('ActivityLogController Unit Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let controller: ActivityLogController;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    controller = new ActivityLogController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createActivityLog', () => {
    it('should create an activity log and return 201', async () => {
      // Mock repository function
      const mockCreate = jest.spyOn(ActivityLogRepository.prototype, 'create').mockResolvedValue(mockActivityData as unknown as never);

    //   req.body = { action: 'test action' };
      req.body = mockActivityData

      await controller.createActivityLog(req as Request, res as Response);

      expect(mockCreate).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
    //   expect(res.json).toHaveBeenCalledWith({
    //     message: 'Activity log created successfully',
    //     activityLog: mockActivityData,
    //   });

      mockCreate.mockReset();
      mockCreate.mockRestore();
    });

    it('should return 500 on repository error', async () => {
      // Simulate repository error
      const mockCreate = jest.spyOn(ActivityLogRepository.prototype, 'create').mockRejectedValue(new Error('Database error'));

      req.body = { action: 'test action' };

      await controller.createActivityLog(req as Request, res as Response);

      expect(mockCreate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to create activity log',
        error: 'Database error',
      });
      expect(Logger.error).toHaveBeenCalledWith('Failed to create activity log: Database error');
    });
  });

  describe('getActivityLogsByUserId', () => {
    it('should return activity logs for a user and return 200', async () => {
      const mockFindByUserId = jest.spyOn(ActivityLogRepository.prototype, 'findByUserId').mockResolvedValue([mockActivityData]);

      req.params = { userId: 'user1' };

      await controller.getActivityLogsByUserId(req as Request, res as Response);

      expect(mockFindByUserId).toHaveBeenCalledWith('user1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockActivityData]);
    });

    it('should return 404 if no activity logs found for a user', async () => {
      const mockFindByUserId = jest.spyOn(ActivityLogRepository.prototype, 'findByUserId').mockResolvedValue([]);

      req.params = { userId: 'user1' };

      await controller.getActivityLogsByUserId(req as Request, res as Response);

      expect(mockFindByUserId).toHaveBeenCalledWith('user1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No activity logs found for this user',
      });
    });

    it('should return 500 on repository error', async () => {
      const mockFindByUserId = jest.spyOn(ActivityLogRepository.prototype, 'findByUserId').mockRejectedValue(new Error('Database error'));

      req.params = { userId: 'user1' };

      await controller.getActivityLogsByUserId(req as Request, res as Response);

      expect(mockFindByUserId).toHaveBeenCalledWith('user1');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to retrieve activity logs',
        error: 'Database error',
      });
      expect(Logger.error).toHaveBeenCalledWith('Failed to retrieve activity logs by user ID: Database error');
    });
  });

  describe('getActivityLogById', () => {
    it('should return an activity log by ID and return 200', async () => {
      const mockFindById = jest.spyOn(ActivityLogRepository.prototype, 'findById').mockResolvedValue(mockActivityData);

      req.params = { id: '1' };

      await controller.getActivityLogById(req as Request, res as Response);

      expect(mockFindById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockActivityData);
    });

    it('should return 404 if activity log not found', async () => {
      const mockFindById = jest.spyOn(ActivityLogRepository.prototype, 'findById').mockResolvedValue(null);

      req.params = { id: '1' };

      await controller.getActivityLogById(req as Request, res as Response);

      expect(mockFindById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Activity log not found',
      });
    });

    it('should return 500 on repository error', async () => {
      const mockFindById = jest.spyOn(ActivityLogRepository.prototype, 'findById').mockRejectedValue(new Error('Database error'));

      req.params = { id: '1' };

      await controller.getActivityLogById(req as Request, res as Response);

      expect(mockFindById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to retrieve activity log',
        error: 'Database error',
      });
      expect(Logger.error).toHaveBeenCalledWith('Failed to retrieve activity log by ID: Database error');
    });
  });

  describe('deleteActivityLog', () => {
    it('should delete an activity log and return 200', async () => {
      const mockDelete = jest.spyOn(ActivityLogRepository.prototype, 'delete').mockResolvedValue(mockActivityData);

      req.params = { id: "1" };

      await controller.deleteActivityLog(req as Request, res as Response);

      expect(mockDelete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Activity log deleted successfully',
        activityLog: { id: '1' },
      });
    });

    it('should return 404 if activity log not found', async () => {
      const mockDelete = jest.spyOn(ActivityLogRepository.prototype, 'delete').mockResolvedValue(null);

      req.params = { id: '1' };

      await controller.deleteActivityLog(req as Request, res as Response);

      expect(mockDelete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Activity log not found',
      });
    });

    it('should return 500 on repository error', async () => {
      const mockDelete = jest.spyOn(ActivityLogRepository.prototype, 'delete').mockRejectedValue(new Error('Database error'));

      req.params = { id: '1' };

      await controller.deleteActivityLog(req as Request, res as Response);

      expect(mockDelete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to delete activity log',
        error: 'Database error',
      });
      expect(Logger.error).toHaveBeenCalledWith('Failed to delete activity log: Database error');
    });
  });
});

