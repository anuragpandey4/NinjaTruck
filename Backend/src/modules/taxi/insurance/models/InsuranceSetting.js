import mongoose from 'mongoose';

const insuranceSettingSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: true,
    },
    bannerTitle: {
      type: String,
      default: 'Vehicle Insurance',
      trim: true,
    },
    bannerSubtitle: {
      type: String,
      default: 'Instant coverage plans for your rides',
      trim: true,
    },
    policyTermsLabel: {
      type: String,
      default: 'Monthly, 6-Month, & Annual Coverage',
      trim: true,
    },
    bannerImageUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const InsuranceSettingModel =
  mongoose.models.TaxiInsuranceSetting ||
  mongoose.model('TaxiInsuranceSetting', insuranceSettingSchema);

export const InsuranceSetting = InsuranceSettingModel;

// Always returns the singleton settings document, creating defaults if needed
export const getOrCreateInsuranceSettings = async () => {
  let settings = await InsuranceSetting.findOne({});
  if (!settings) {
    settings = await InsuranceSetting.create({});
  }
  return settings;
};
