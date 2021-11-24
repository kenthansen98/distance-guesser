interface Props {
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const NumRoundsSelect: React.FC<Props> = ({ onChange }) => {
    return (
        <label className="block mt-4">
            <span className="text-gray-700 font-semibold">
                Number of Rounds
            </span>
            <select
                className="form-select mt-2 ml-3 w-16 ring-1 ring-gray-600 rounded-sm"
                onChange={onChange}
            >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </select>
        </label>
    );
};

export default NumRoundsSelect;
