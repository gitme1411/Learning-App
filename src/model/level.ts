import Realm, {BSON} from 'realm';
import {Question} from './question';
import TopicInfo from './topic_info';

export class Level extends Realm.Object {
  created_at!: string;
  deleted_at!: number;
  id!: number;
  is_lock!: boolean;
  is_passed!: boolean;
  m_topic_id!: number;
  name!: string;
  numberPass?: number;
  percentPass?: number;
  progress!: number;
  total_questions!: number;
  updated_at!: string;
  questions_flash!: Realm.List<Question>;
  random_questions!: Realm.List<Question>;
  topic_info!: TopicInfo;
  dateAnswer!: string;
  oldNumberPass!: number;

  static schema: Realm.ObjectSchema = {
    name: 'level',
    // embedded: true,
    primaryKey: 'id',
    properties: {
      created_at: 'string',
      deleted_at: 'string?',
      id: 'int',
      is_lock: 'bool',
      is_passed: 'bool?',
      m_topic_id: 'int',
      name: 'string',
      numberPass: 'int?',
      percentPass: 'int?',
      progress: 'int?',
      total_questions: 'int',
      updated_at: 'string',
      questions_flash: 'question[]',
      random_questions: 'question[]',
      topic_info: 'TopicInfo',
      dateAnswer: 'string?',
      oldNumberPass: 'int?',
      //   manufacturer: {
      //     type: 'linkingObjects',
      //     objectType: 'Topic',
      //     property: 'data_level',
      //   },
    },
  };
}
