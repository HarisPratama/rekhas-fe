export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  code: string;
  nickname: string;
  image_url: string;
  full_image_url?: string;
  is_pic: boolean;
  payments: string;
  whatsapp_number: string;
  roleId: number;
  checkpoint_id: number | null;
  created_at: string; // or `Date` if you parse it
  updated_at: string; // or `Date` if you parse it
  role: Role;
}
