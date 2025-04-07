export default class EventRegister {
  static listeners: {count: number; refs: any} = {
    count: 0,
    refs: {},
  };

  /**
   * Add event listener
   */
  static addEventListener<T>(
    eventName: string,
    callback: (response: T | undefined) => void,
  ) {
    if (typeof callback === 'function') {
      EventRegister.listeners.count++;
      const eventId = 'l' + EventRegister.listeners.count;
      EventRegister.listeners.refs[eventId] = {
        name: eventName,
        callback,
      };
      return eventId;
    }
    return false;
  }

  /**
   * Handle remove listener event
   */
  static removeEventListener(id: string): boolean {
    const idEvent = EventRegister.getIdEvent(id);
    if (idEvent === undefined) return false;
    return delete EventRegister.listeners.refs[idEvent];
  }

  static getIdEvent(eventName: string): string {
    const idEvent = Object.keys(EventRegister.listeners.refs)
      .filter(key => {
        return eventName === EventRegister.listeners.refs[key].name;
      })
      .map(key => key);
    if (idEvent.length > 0) {
      return idEvent[0];
    }
    return '';
  }

  /**
   * Handle remove all listener
   */
  static removeAllListeners() {
    let removeError = false;
    Object.keys(EventRegister.listeners.refs).forEach(id => {
      const removed = delete EventRegister.listeners.refs[id];
      removeError = !removeError ? !removed : removeError;
    });
    return !removeError;
  }

  /**
   * Handle emit event
   */
  static emitEvent<T>(eventName: string, data: T) {
    Object.keys(EventRegister.listeners.refs).forEach(id => {
      if (
        EventRegister.listeners.refs[id] &&
        eventName === EventRegister.listeners.refs[id].name
      )
        EventRegister.listeners.refs[id].callback(data);
    });
  }

  /**
   * Handle on event
   */
  static on<T>(eventName: string, callback: (response: T | undefined) => void) {
    return EventRegister.addEventListener<T>(eventName, callback);
  }

  /**
   * Handle off event
   */
  static off(eventName: string) {
    return EventRegister.removeEventListener(eventName);
  }

  /**
   * Handle off all event
   */
  static offAll() {
    return EventRegister.removeAllListeners();
  }

  /**
   * Handle emit event
   */
  static emit<T>(eventName: string, data: T) {
    EventRegister.emitEvent<T>(eventName, data);
  }
}
