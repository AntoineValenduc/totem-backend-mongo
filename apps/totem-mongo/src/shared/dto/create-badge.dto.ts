export class CreateBadgeDto {
  readonly name: string;
  readonly description: string;
  readonly photo: string;
  readonly progress: number;
  readonly status: string;
  readonly dateEarned: Date;
}
