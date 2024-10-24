export interface ISetting {
  Id: number;          // Unique identifier for the setting
  Key: string;          // Key for the setting
  Value1: string;      // First value associated with the setting
  Value2: string;      // Second value associated with the setting
  Value3: string;      // Third value associated with the setting
  Value4: string;      // Fourth value associated with the setting
  Description: string; // Description of the setting
  IsActive: boolean;   // Indicates if the setting is active
}