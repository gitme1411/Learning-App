import Realm from 'realm';

export class Answer extends Realm.Object {
  answer_cn?: string;
  answer_en?: string;
  answer_ja?: string;
  answer_kr?: string;
  answer_vi?: string;
  id!: number;
  is_true!: number;
  m_question_id!: number;

  static schema: Realm.ObjectSchema = {
    name: 'answer',
    properties: {
      answer_cn: 'string?',
      answer_en: 'string?',
      answer_ja: 'string?',
      answer_kr: 'string?',
      answer_vi: 'string?',
      id: 'int',
      is_true: 'int?',
      m_question_id: 'int?',
    },
  };
}
