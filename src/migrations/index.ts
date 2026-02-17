import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20251215_162220_Add_custom_collections__games__levels__opponents__players__posts__rosters__years from './20251215_162220_Add_custom_collections__games__levels__opponents__players__posts__rosters__years';
import * as migration_20251218_174646_add_rosters_versions from './20251218_174646_add_rosters_versions';
import * as migration_20251219_030816_relation_fields_added from './20251219_030816_relation_fields_added';
import * as migration_20251220_031030 from './20251220_031030';
import * as migration_20260215_142943_add_form_submissions_collection from './20260215_142943_add_form_submissions_collection';
import * as migration_20260215_154733_add_formatted_data_field from './20260215_154733_add_formatted_data_field';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20251215_162220_Add_custom_collections__games__levels__opponents__players__posts__rosters__years.up,
    down: migration_20251215_162220_Add_custom_collections__games__levels__opponents__players__posts__rosters__years.down,
    name: '20251215_162220_Add_custom_collections__games__levels__opponents__players__posts__rosters__years',
  },
  {
    up: migration_20251218_174646_add_rosters_versions.up,
    down: migration_20251218_174646_add_rosters_versions.down,
    name: '20251218_174646_add_rosters_versions',
  },
  {
    up: migration_20251219_030816_relation_fields_added.up,
    down: migration_20251219_030816_relation_fields_added.down,
    name: '20251219_030816_relation_fields_added',
  },
  {
    up: migration_20251220_031030.up,
    down: migration_20251220_031030.down,
    name: '20251220_031030',
  },
  {
    up: migration_20260215_142943_add_form_submissions_collection.up,
    down: migration_20260215_142943_add_form_submissions_collection.down,
    name: '20260215_142943_add_form_submissions_collection',
  },
  {
    up: migration_20260215_154733_add_formatted_data_field.up,
    down: migration_20260215_154733_add_formatted_data_field.down,
    name: '20260215_154733_add_formatted_data_field'
  },
];
