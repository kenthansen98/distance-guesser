interface Props {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TravelTypeSelect: React.FC<Props> = ({ onChange }) => {
    return (
        <div className="mt-4">
            <span className="text-gray-700 font-semibold">Trip Type</span>
            <div className="mt-2">
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        className="form-checkbox ring-1 ring-gray-700 rounded-sm"
                        name="travelType"
                        value="driving"
                        onChange={onChange}
                    />
                    <span className="ml-2">Driving</span>
                </label>
                <label className="inline-flex items-center ml-6">
                    <input
                        type="checkbox"
                        className="form-checkbox ring-1 ring-gray-700 rounded-sm"
                        name="travelType"
                        value="walking"
                        onChange={onChange}
                    />
                    <span className="ml-2">Walking</span>
                </label>
                <label className="inline-flex items-center ml-6">
                    <input
                        type="checkbox"
                        className="form-checkbox ring-1 ring-gray-700 rounded-sm"
                        name="travelType"
                        value="cycling"
                        onChange={onChange}
                    />
                    <span className="ml-2">Cycling</span>
                </label>
            </div>
        </div>
    );
};

export default TravelTypeSelect;
