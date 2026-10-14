/**
 * MotionStudio Core - Event Bus
 * Lightweight event system for decoupled pub/sub inter-module communication.
 * NextGen • Developed by A.K.Antal
 */

class EventBusClass {
  constructor() {
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.events.has(event)) {
      this.events.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[EventBus] Error in handler for event "${event}":`, err);
        }
      });
    }
  }
}

export const eventBus = new EventBusClass();

export const EventBus = {
  on: (event, cb) => eventBus.on(event, cb),
  off: (event, cb) => eventBus.off(event, cb),
  emit: (event, data) => eventBus.emit(event, data)
};

export default EventBus;
