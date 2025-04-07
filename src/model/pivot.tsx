import Realm from 'realm';

class Pivot extends Realm.Object {
    m_question_id!: number;
    m_test_id!: number;

  static schema: Realm.ObjectSchema = {
    name: 'Pivot',
    properties: {
        m_question_id: 'int?',
        m_test_id: 'int?',
    },
  };
}
export default Pivot;
