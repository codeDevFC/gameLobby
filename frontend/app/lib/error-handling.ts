export class ErrorHandler {
  static async handle(error: Error, context?: any) {
    console.error('❌ Error:', error.message);
    console.error('📋 Context:', context);
    
    return {
      message: this.getUserFriendlyMessage(error),
      code: this.getErrorCode(error),
    };
  }

  private static getUserFriendlyMessage(error: Error): string {
    if (error.message.includes('network')) {
      return 'Network error. Please check your connection.';
    }
    if (error.message.includes('authentication')) {
      return 'Please sign in to continue.';
    }
    return 'Something went wrong. Please try again.';
  }

  private static getErrorCode(error: Error): number {
    if (error.message.includes('not found')) return 404;
    if (error.message.includes('unauthorized')) return 401;
    return 500;
  }
}
