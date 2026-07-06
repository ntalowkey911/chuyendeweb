import api from './api';

export const getProvinces = async () => {
  const response = await api.get('/ghn/provinces');
  return response.data;
};

export const getDistricts = async (provinceId: number) => {
  const response = await api.get(`/ghn/districts?province_id=${provinceId}`);
  return response.data;
};

export const getWards = async (districtId: number) => {
  const response = await api.get(`/ghn/wards?district_id=${districtId}`);
  return response.data;
};

export const calculateFee = async (
  toDistrictId: number,
  toWardCode: string,
  weight: number = 800,
  length: number = 20,
  width: number = 15,
  height: number = 25
) => {
  const response = await api.post('/ghn/fee', {
    to_district_id: toDistrictId,
    to_ward_code: toWardCode,
    weight,
    length,
    width,
    height,
  });
  return response.data;
};
