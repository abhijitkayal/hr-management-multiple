"use client";

import {
  useEffect,
  useState,
} from "react";

export default function SettingsPage() {

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState({
    businessName: "",
    businessEmail: "",
    address: "",
    phone: "",
    tagline: "",
    logo: "",
  });

  // FETCH SETTINGS
  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {

    try {

      const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          ) || "{}"
        );

      const res =
        await fetch(
          `/api/settings?branchName=${user.branchName}`
        );

      const data =
        await res.json();

      if (
        data.success &&
        data.setting
      ) {

        setFormData({
          businessName:
            data.setting
              .businessName || "",

          businessEmail:
            data.setting
              .businessEmail || "",

          address:
            data.setting
              .address || "",

          phone:
            data.setting
              .phone || "",

          tagline:
            data.setting
              .tagline || "",

          logo:
            data.setting
              .logo || "",
        });
      }

    } catch (error) {
      console.log(error);
    }
  }

  // HANDLE INPUT CHANGE
  function handleChange(
    e: any
  ) {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  }

  // HANDLE LOGO CHANGE
  function handleLogoChange(
    e: any
  ) {

    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.readAsDataURL(
      file
    );

    reader.onloadend =
      () => {

      setFormData({
        ...formData,

        logo:
          reader.result as string,
      });
    };
  }

  // SAVE SETTINGS
  async function handleSubmit(
    e: any
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          ) || "{}"
        );

      const res =
        await fetch(
          "/api/settings",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              ...formData,

              branchName:
                user.branchName,
            }),
          }
        );

      const data =
        await res.json();

      if (data.success) {

        alert(
          "Settings Saved Successfully"
        );

        fetchSettings();
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

        {/* HEADER */}
        <div className="bg-black text-white px-8 py-6">

          <h1 className="text-3xl font-bold">
            Business Settings
          </h1>

          <p className="text-sm text-gray-300 mt-1">
            Manage your company profile and branding
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          className="p-8 space-y-6"
        >

          {/* LOGO */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Business Logo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleLogoChange
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
            />

            {formData.logo && (

              <div className="mt-4">

                <img
                  src={formData.logo}
                  alt="logo"
                  className="w-28 h-28 rounded-2xl object-cover border shadow"
                />

              </div>
            )}

          </div>

          {/* BUSINESS NAME */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Business Name
            </label>

            <input
              type="text"
              name="businessName"
              value={
                formData.businessName
              }
              onChange={
                handleChange
              }
              placeholder="Enter business name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />

          </div>

          {/* BUSINESS EMAIL */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Business Email
            </label>

            <input
              type="email"
              name="businessEmail"
              value={
                formData.businessEmail
              }
              onChange={
                handleChange
              }
              placeholder="Enter business email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />

          </div>

          {/* PHONE */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              placeholder="Enter phone number"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />

          </div>

          {/* ADDRESS */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address
            </label>

            <textarea
              name="address"
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              rows={4}
              placeholder="Enter business address"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />

          </div>

          {/* TAGLINE */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tagline
            </label>

            <input
              type="text"
              name="tagline"
              value={
                formData.tagline
              }
              onChange={
                handleChange
              }
              placeholder="Enter business tagline"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />

          </div>

          {/* BUTTON */}
          <div>

            <button
              type="submit"
              disabled={loading}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
            >

              {loading
                ? "Saving..."
                : "Save Settings"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}