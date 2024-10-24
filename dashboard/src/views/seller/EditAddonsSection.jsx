import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
const EditAddonsSection = ({ addons, setAddons, errors }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const currencySymbol = userInfo?.currency?.symbol || "";

  const addOption = (addonIndex) => {
    // Clone addons array and options array immutably
    const newAddons = addons.map((addon, i) =>
      i === addonIndex
        ? { ...addon, options: [...addon.options, { text: "", price: "" }] }
        : addon
    );
    setAddons(newAddons);
  };

  const removeOption = (addonIndex, optionIndex) => {
    const newAddons = addons.map((addon, i) =>
      i === addonIndex
        ? {
            ...addon,
            options: addon.options.filter(
              (_, oIndex) => oIndex !== optionIndex
            ),
          }
        : addon
    );
    setAddons(newAddons);
  };

  const handleAddonChange = (index, field, value) => {
    const newAddons = addons.map((addon, i) =>
      i === index ? { ...addon, [field]: value } : addon
    );
    setAddons(newAddons);
  };

  const handleOptionChange = (addonIndex, optionIndex, field, value) => {
    const newAddons = addons.map((addon, i) =>
      i === addonIndex
        ? {
            ...addon,
            options: addon.options.map((option, oIndex) =>
              oIndex === optionIndex ? { ...option, [field]: value } : option
            ),
          }
        : addon
    );
    setAddons(newAddons);
  };
  const addNewAddon = () => {
    setAddons([
      ...addons,
      { question: "", options: [], type: "Drop-Down List" },
    ]);
  };

  const removeAddon = (addonIndex) => {
    const newAddons = addons.filter((_, index) => index !== addonIndex);
    setAddons(newAddons);
  };

  return (
    <div className="flex flex-col w-full gap-4 text-[#000000] mb-5">
      {addons.map((addon, addonIndex) => (
        <div
          key={addonIndex}
          className="p-4 border border-slate-700 rounded-md"
        >
          <h3 className="text-lg font-semibold mb-4">Edit product option</h3>
          <button
            type="button"
            onClick={() => removeAddon(addonIndex)}
            className="text-red-500 hover:text-red-600"
          >
            <IoCloseSharp size={20} />
          </button>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Option name</label>
              <input
                className="w-full px-4 py-2 bg-[#ffffff] border border-slate-700 rounded-md focus:border-indigo-500 focus:outline-none"
                type="text"
                placeholder="Enter option name"
                value={addon.question}
                onChange={(e) =>
                  handleAddonChange(addonIndex, "question", e.target.value)
                }
              />
              {errors[`addon_question_${addonIndex}`] && (
                <span className="text-red-500">
                  {errors[`addon_question_${addonIndex}`]}
                </span>
              )}
            </div>
            <div>
              <label className="block mb-2">Option type</label>
              <select
                className="w-full px-4 py-2 bg-[#ffffff] border border-slate-700 rounded-md focus:border-indigo-500 focus:outline-none"
                value={addon.type || "Drop-Down List"}
                onChange={(e) =>
                  handleAddonChange(addonIndex, "type", e.target.value)
                }
              >
                <option>Drop-Down List</option>
                <option>Radio Buttons</option>
                <option>Checkboxes</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Option values</label>
            {addon.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-4 mb-2">
                <span className="text-slate-400">⁝⁝</span>
                <input
                  className="flex-grow px-4 py-2 bg-[#ffffff] border border-slate-700 rounded-md focus:border-indigo-500 focus:outline-none"
                  type="text"
                  placeholder="Option value"
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(
                      addonIndex,
                      optionIndex,
                      "text",
                      e.target.value
                    )
                  }
                />
                {errors[`addon_option_text_${addonIndex}_${optionIndex}`] && (
                  <span className="text-red-500">
                    {errors[`addon_option_text_${addonIndex}_${optionIndex}`]}
                  </span>
                )}

                <div className="flex items-center">
                  <span className="mr-2">+</span>
                  <input
                    className="w-24 px-4 py-2 bg-[#ffffff] border border-slate-700 rounded-md focus:border-indigo-500 focus:outline-none"
                    type="number"
                    placeholder="Price"
                    value={option.price}
                    onChange={(e) =>
                      handleOptionChange(
                        addonIndex,
                        optionIndex,
                        "price",
                        e.target.value
                      )
                    }
                  />

                  <span className="ml-2">{currencySymbol}</span>
                  {errors[
                    `addon_option_price_${addonIndex}_${optionIndex}`
                  ] && (
                    <span className="text-red-500">
                      {
                        errors[
                          `addon_option_price_${addonIndex}_${optionIndex}`
                        ]
                      }
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeOption(addonIndex, optionIndex)}
                  className="text-red-500 hover:text-red-600"
                >
                  <IoCloseSharp size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(addonIndex)}
              className="text-blue-500 hover:text-blue-600 mt-2"
            >
              + Add value
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addNewAddon}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 mt-4"
      >
        Add Option
      </button>
    </div>
  );
};

export default EditAddonsSection;
