export type Guild = {
  features: Array<string>;
  icon: string | null;
  id: string;
  name: string;
  owner: boolean;
  permissions: number;
  permissions_new: string;
};
