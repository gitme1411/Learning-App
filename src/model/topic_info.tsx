import Realm from 'realm';

class TopicInfo extends Realm.Object {
  id!: number;
  m_app_id!: number;
  name!: string;
  progress!: number;
  total_questions!: number;

  static schema: Realm.ObjectSchema = {
    name: 'TopicInfo',
    properties: {
      id: 'int',
      m_app_id: 'int?',
      name: 'string',
      progress: 'int?',
      total_questions: 'int?',
    },
  };
}
export default TopicInfo;
