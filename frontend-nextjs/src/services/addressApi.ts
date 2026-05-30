export interface Province {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
}

export interface District {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
}

export interface Ward {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  district_code: number;
}

export const addressApi = {
  getProvinces: async (): Promise<Province[]> => {
    try {
      const res = await fetch("https://provinces.open-api.vn/api/p/");
      return res.json();
    } catch (e) {
      console.error("Failed to fetch provinces", e);
      return [];
    }
  },

  getDistricts: async (provinceCode: number): Promise<District[]> => {
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      const data = await res.json();
      return data.districts || [];
    } catch (e) {
      console.error("Failed to fetch districts", e);
      return [];
    }
  },

  getWards: async (districtCode: number): Promise<Ward[]> => {
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      const data = await res.json();
      return data.wards || [];
    } catch (e) {
      console.error("Failed to fetch wards", e);
      return [];
    }
  },
};
