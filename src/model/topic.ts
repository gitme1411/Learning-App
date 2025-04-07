import Realm, {BSON, List} from 'realm';
import {Level} from './level';

class Topic extends Realm.Object {
  id!: number;
  name!: string;
  m_app_id!: number;
  progress!: number;
  numberPass?: number;
  numberFail?: number;
  percentPass?: string;
  total_questions!: number;
  data_level!: Realm.List<Level>;
  static schema: Realm.ObjectSchema = {
    name: 'Topic',
    primaryKey: 'id',
    properties: {
      id: 'int',
      name: 'string',
      m_app_id: 'int',
      progress: 'int',
      numberPass: 'int?',
      numberFail: 'int?',
      percentPass: 'string?',
      total_questions: 'int',
      data_level: 'level[]',
    },
  };
}

export default Topic;
