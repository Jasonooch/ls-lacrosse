import * as migration_20260218_042218 from './20260218_042218';
import * as migration_20260218_051352 from './20260218_051352';
import * as migration_20260218_090000 from './20260218_090000';
import * as migration_20260723_131859_drills_library from './20260723_131859_drills_library';
import * as migration_20261016_033928_hall_of_fame from './20261016_033928_hall_of_fame';
import * as migration_20261016_112243_remove_drills from './20261016_112243_remove_drills';

export const migrations = [
  {
    up: migration_20260218_042218.up,
    down: migration_20260218_042218.down,
    name: '20260218_042218',
  },
  {
    up: migration_20260218_051352.up,
    down: migration_20260218_051352.down,
    name: '20260218_051352',
  },
  {
    up: migration_20260218_090000.up,
    down: migration_20260218_090000.down,
    name: '20260218_090000',
  },
  {
    up: migration_20260723_131859_drills_library.up,
    down: migration_20260723_131859_drills_library.down,
    name: '20260723_131859_drills_library',
  },
  {
    up: migration_20261016_033928_hall_of_fame.up,
    down: migration_20261016_033928_hall_of_fame.down,
    name: '20261016_033928_hall_of_fame',
  },
  {
    up: migration_20261016_112243_remove_drills.up,
    down: migration_20261016_112243_remove_drills.down,
    name: '20261016_112243_remove_drills'
  },
];
