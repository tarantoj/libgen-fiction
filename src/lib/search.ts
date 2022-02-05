import cheerio from "cheerio";
import axios from "axios";
import type { SearchQuery } from "../types";
import { URL } from "node:url";

const libgenis = "https://libgen.is/";

const queryToString = (
    input: Exclude<SearchQuery[keyof SearchQuery], undefined>
): string => {
    if (typeof input === "string") return input;
    else return input ? "1" : "0";
};

const buildUrl = (query: SearchQuery, mirror: string = libgenis) => {
    const url = new URL("/fiction/", libgenis);
    Object.entries(query).forEach(
        ([key, value]) =>
            value !== undefined &&
            url.searchParams.set(key, queryToString(value))
    );
    return url;
};

const parse = (responseText: string) => {
    const $ = cheerio.load(responseText);

    const cols: string[] = [];
    const results: object[] = [];

    $(".catalog>thead>tr>td").each(() => {
        cols.push($(this).text().trim().toLowerCase());
    });

    $(".catalog>tbody>tr").each(function (id) {
        const row = <any>{ id: id + 1 };
        $(this)
            .find("td")
            .each((index) => {
                row[cols[index]] = $(this).text();
            });
        results.push(row);
    });

    console.log(cols, results);
};

const search = async (query: SearchQuery) => {
    const response = await axios.get(buildUrl(query).toString());
    const results = parse(response.data);
};

export { search };
