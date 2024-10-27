export interface ISetting {
  id: number;          // Unique identifier for the setting
  key: string;          // Key for the setting
  valStr?: string;      // First value associated with the setting
  valStr2?: string;      // Second value associated with the setting
  valInt?: number;      // Third value associated with the setting
  valDbl?: number;      // Third value associated with the setting
  valBool?: boolean;      // Fourth value associated with the setting
  valDate?: string;      // Fourth value associated with the setting
  description?: string; // Description of the setting
  isActive?: boolean;   // Indicates if the setting is active
}