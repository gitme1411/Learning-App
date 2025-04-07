import Realm from 'realm';
import Pivot from './pivot';
import {Answer} from './answer';

export class Wrong extends Realm.Object {
  content_cn?: string;
  content_en?: string;
  content_ja?: string;
  content_kr?: string;
  content_vi?: string;
  explanation_cn?: string;
  explanation_en?: string;
  explanation_ja?: string;
  explanation_kr?: string;
  explanation_vi?: string;
  critical_sentence!: number;
  id!: number;
  is_favourite?: boolean;
  m_topic_id!: number;
  user_answers?: number;
  flash_card_answers!: Realm.List<Answer>;
  pivot!: Pivot;
  answers_random!: Realm.List<Answer>;

  static schema: Realm.ObjectSchema = {
    name: 'wrong',
    properties: {
      content_cn: 'string?',
      content_en: 'string?',
      content_ja: 'string?',
      content_kr: 'string?',
      content_vi: 'string?',
      explanation_cn: 'string?',
      explanation_en: 'string?',
      explanation_ja: 'string?',
      explanation_kr: 'string?',
      explanation_vi: 'string?',
      critical_sentence: 'int',
      id: 'int',
      is_favourite: 'bool?',
      m_topic_id: 'int?',
      user_answers: 'int?',
      is_passed: 'bool?',
      flash_card_answers: 'answer[]',
      pivot: 'Pivot',
      answers_random: 'answer[]',
    },
  };
}
