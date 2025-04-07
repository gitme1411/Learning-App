import Realm from 'realm';
import {Question} from './question';

class Practice extends Realm.Object {
  id!: number;
  is_passed!: boolean;
  m_app_id!: number;
  name!: string;
  numberPass?: number;
  numberFail?: number;
  percentPass?: number;
  progress!: number;
  total_questions!: number;
  random_questions!: Realm.List<Question>;
  dateAnswer!: string;
  oldNumberPass!: number;
  static schema: Realm.ObjectSchema = {
    name: 'Practice',
    // embedded: true,
    primaryKey: 'id',
    properties: {
      id: 'int',
      is_passed: 'bool?',
      m_app_id: 'int',
      name: 'string',
      numberPass: 'int?',
      numberFail: 'int?',
      percentPass: 'int?',
      progress: 'int?',
      total_questions: 'int',
      random_questions: 'question[]',
      dateAnswer: 'string?',
      oldNumberPass: 'int?',
    },
  };
}
export default Practice;
