// tests/controllers/kanjiController.test.ts
// Unit tests for KanjiController.test
import { Request, Response } from 'express'
import * as controller from '../../src/controllers/kanji-controller'
import * as service from '../../src/services/kanji-service'
import { KanjiDetails } from '@shared/types/kanji-details'

describe('Kanji Controller', () => {
  // Test for getJlptLevels controller method
  it('getJlptLevels should return levels with 200', async () => {
    // Mocked response data
    const mockLevels = [{ id: 1, level: 'N5', description: 'Basic' }]
    // Mock the service function to resolve with mockLevels
    jest.spyOn(service, 'fetchJlptLevels').mockResolvedValue(mockLevels)

    // Create mock req/res objects
    const req = {} as Request
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Allows chaining status().json()
    } as any as Response

    // Call controller and assert behavior
    await controller.getJlptLevels(req, res)

    expect(res.json).toHaveBeenCalledWith(mockLevels)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  // Grouping tests for getKanjiByJlptLevel controller
  describe('getKanjiByJLPTLevel', () => {
    const mockKanjis = [
      { id: 1, character: '日' },
      { id: 2, character: 'T' },
    ]

    // Re-mock service call before each test
    beforeEach(async () => {
      jest
        .spyOn(service, 'fetchJlptKanjisByLevel')
        .mockResolvedValue(mockKanjis)
    })

    it('should return all kanji with jlpt level and status 200', async () => {
      const req = {
        params: { level: '2' },
        query: {},
      } as any as Request
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response

      await controller.getKanjiByJlptLevel(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockKanjis)
    })

    it('should return 200, empty lists', async () => {
      const req = {
        params: { level: '9' }, // Invalid level
        query: {},
      } as any as Request
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response

      await controller.getKanjiByJlptLevel(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  // Test for getKanjiDetails with valid ID
  it('getKanjiDetails should return KanjiDetails and status 200', async () => {
    const mockKanjiDetails = { id: 1, character: '日' } as any as KanjiDetails
    jest.spyOn(service, 'fetchKanjiDetails').mockResolvedValue(mockKanjiDetails)

    const req = { params: { kanjiId: '123' } } as any as Request
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as any as Response

    await controller.getKanjiDetails(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockKanjiDetails)
  })

  // Test for getKanjiDetails when the ID doesn't exist
  it('getKanjiDetails should return 404 if kanji not found', async () => {
    jest.spyOn(service, 'fetchKanjiDetails').mockResolvedValue(null)

    const req = { params: { kanjiId: '123' } } as any as Request
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any as Response

    await controller.getKanjiDetails(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.send).toHaveBeenCalledWith('Kanji with id 123 was not found')
  })
})
