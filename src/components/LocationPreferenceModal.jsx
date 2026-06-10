import { setLocationMode } from "../app/api/weather";

function LocationPreferenceModal({ open, onComplete }) {

    if (!open) return null;

    const handleAccurate = () => {
        setLocationMode("accurate");
        onComplete();
    };

    const handleFast = () => {
        setLocationMode("fast");
        onComplete();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
            <div className="w-[460px] rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-gray-900"> Weather Personalization </h2>
                <p className="mt-3 text-sm text-gray-600">
                    Choose how weather is detected for your scene.
                </p>
                <div className="mt-5 space-y-3">
                    <button onClick={handleAccurate}
                        className="w-full rounded-lg border p-4 text-left">
                        <div className="font-medium">
                            Accurate Location
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                            Uses your precise location. A browser permission prompt may appear.
                        </div>
                    </button>
                    <button onClick={handleFast} className="w-full rounded-lg border p-4 text-left">
                        <div className="font-medium"> Fast Location </div>
                        <div className="mt-1 text-sm text-gray-500">
                            Uses city-level IP location.
                            No permission prompt required.
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
export default LocationPreferenceModal;