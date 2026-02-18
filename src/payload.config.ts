import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Level } from './collections/Level'
import { Years } from './collections/Years'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Players } from './collections/Players'
import { Opponents } from './collections/Opponents'
import { Rosters } from './collections/Rosters'
import { Games } from './collections/Games'
import { Coaches } from './collections/Coaches'
import { CoachingStaff } from './collections/CoachingStaff'
import { FormSubmissions } from './collections/FormSubmissions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
const buildOnlySecret = 'build-only-payload-secret'
const payloadSecret = process.env.PAYLOAD_SECRET || (isBuildPhase ? buildOnlySecret : undefined)

if (!payloadSecret) {
  throw new Error(
    'PAYLOAD_SECRET environment variable is required.\n' +
      'Generate one using: openssl rand -hex 32\n' +
      'Then add it to your .env file or Vercel environment variables.',
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Posts,
    Categories,
    Games,
    Players,
    Rosters,
    Opponents,
    CoachingStaff,
    Coaches,
    FormSubmissions,
    Users,
    Media,
    Level,
    Years,
  ],
  editor: lexicalEditor(),
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  plugins: [
    seoPlugin({
      collections: ['posts'],
      uploadsCollection: 'media',
    }),
    s3Storage({
      collections: { media: true },
      bucket: process.env.R2_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
        region: 'auto',
        endpoint: process.env.R2_ENDPOINT,
      },
    }),
  ],
})
