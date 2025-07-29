import { Magnifier } from "assets/images/icons";
import { useSearchParams } from "react-router-dom";

const Search = ({ type = 'text', className="", text, onSearch, value }) => {
	const [startDate, history] = useSearchParams();

	return (
		<div className={"custom-search-input " + className}>
			<Magnifier />
			<input
				className="search-input-inner"
				type={type}
				onChange={e => {
					let search = e.target.value.toString()
					onSearch(e.target.value);
					history({ search: search }, { replace: true })
				}}
				placeholder={text}
				value={value} />
		</div>
	);
};

export default Search;
