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

type Link = { href: string; text: string };

type Result = {
    id: number;
    "author(s)": Link[];
    series: string;
    title: Link;
    language: string;
    file: string;
    mirrors: Link[];
    /** Edit link */
    "": Link;
};

const parse = (responseText: string): Result[] => {
    const $ = cheerio.load(responseText);

    const cols: string[] = [];
    const results: Result[] = [];

    $(".catalog>thead>tr>td").each(function (_i, el) {
        cols.push($(el).text().trim().toLowerCase());
    });

    $(".catalog>tbody>tr").each(function (id) {
        const row = <any>{ id: id + 1 };
        $(this)
            .find("td")
            .each(function (index) {
                const list = $(this).find("li");
                row[cols[index]] = list.length
                    ? list
                          .map(function () {
                              const href = $(this).find("a").attr("href");
                              if (href) return { href, text: $(this).text() };
                              else return $(this).text();
                          })
                          .toArray()
                    : $(this).find("a").attr("href")
                    ? {
                          href: $(this).find("a").attr("href"),
                          text: $(this).text(),
                      }
                    : $(this).text();
            });
        results.push(row);
    });
    return results;
};

const search = async (query: SearchQuery) => {
    const response = await axios.get<string>(buildUrl(query).toString());
    return parse(response.data);
};

export { search };
