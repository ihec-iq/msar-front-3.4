import type { IDegreeStage, IBonusJobTitle } from "../bonus/IBonus";
import type { IEmployeeLite } from "../employee/IEmployee";

export interface IPromotion {
  id: number;                     // Unique identifier for the promotion
  Employee: IEmployeeLite;               // Employee associated with the promotion
  numberPromotion: string;        // Unique number for the promotion
  issueDate: string;                // Date when the promotion was issued
  note: string;                   // Additional notes regarding the promotion
  DegreeStage: IDegreeStage;       // Degree stage related to the bonus
  BonusJobTitle: IBonusJobTitle;          // Job title associated with the bonus
}   

export interface IPromotionFilter {
  title: string;
  limit: number;
  employeeName: string;
  isBound: boolean;
}
