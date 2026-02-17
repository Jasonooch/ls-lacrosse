import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Level } from './collections/Level'
import { Years } from './collections/Years'
import { Posts } from './collections/Posts'
import { Players } from './collections/Players'
import { Opponents } from './collections/Opponents'
import { Rosters } from './collections/Rosters'
import { Games } from './collections/Games'
import { Coaches } from './collections/Coaches'
import { CoachingStaff } from './collections/CoachingStaff'
import { FormSubmissions } from './collections/FormSubmissions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isCLI = process.argv.some((value) => value.match(/^(generate|migrate|build):?/))
const isProduction = process.env.NODE_ENV === 'production'

// Validate PAYLOAD_SECRET is set - critical for security (JWT signing, session encryption)
if (!process.env.PAYLOAD_SECRET) {
  throw new Error(
    'PAYLOAD_SECRET environment variable is required.\n' +
      'Generate one using: openssl rand -hex 32\n' +
      'Then add it to your .env file or Cloudflare environment variables.',
  )
}

const payloadSecret = process.env.PAYLOAD_SECRET

const cloudflare =
  isCLI || !isProduction
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Posts,
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
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  plugins: [
    r2Storage({
      // Type assertion needed due to Cloudflare Workers type updates
      // The bucket is compatible at runtime, types just don't align between versions
      bucket: cloudflare.env.R2 as any,
      collections: { media: true },
    }),
  ],
})

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: isProduction,
      } satisfies GetPlatformProxyOptions),
  )
}
