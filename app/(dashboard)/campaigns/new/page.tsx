import { NewCampaignForm } from "@/components/dashboard/new-campaign-form";

export default function NewCampaignPage() {
  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">New campaign</h1>
        <p className="mt-1 text-sm text-gray-500">
          You can fill in deck content and sponsorship tiers after creating the
          campaign.
        </p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <NewCampaignForm />
      </div>
    </div>
  );
}
