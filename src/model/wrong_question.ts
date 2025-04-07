import Realm from 'realm';
import {Wrong} from './wrong';

class WrongQuestion extends Realm.Object {
  id!: number;
  correct!: boolean;
  ques!: Wrong;
  static schema: Realm.ObjectSchema = {
    name: 'WrongQuestion',
    primaryKey: 'id',
    properties: {
      id: 'int',
      correct: 'bool?',
      ques: 'wrong',
    },
  };
}
export default WrongQuestion;
