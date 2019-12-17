/**
 * This unified model interface defines the server generated fields for client
 */
export interface UnifiedModel {
    _id: any; // This _id should be readonly on client side
    readonly createdAt?: string;
    readonly updatedAt?: string;
}