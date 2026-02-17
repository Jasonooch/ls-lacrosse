import type { Payload } from 'payload'

export const seed = async (payload: Payload): Promise<void> => {
  // This is a template for creating seed data
  // You can use this to create consistent test data without syncing from production

  payload.logger.info('Seeding database...')

  // Example: Create a test player
  // await payload.create({
  //   collection: 'players',
  //   data: {
  //     fullName: 'Test Player',
  //     jerseyNumber: 1,
  //     position: 'Attack',
  //     graduationYear: 2025,
  //   },
  // })

  payload.logger.info('Database seeded successfully!')
}
