import { search } from "../../src/lib/search";
import axios from "axios";
import fs from "fs";
import path from "path";
import expectedResults from "./results.json";

jest.mock("axios");

test("Test search parsing", async () => {
    const response = {
        data: fs.readFileSync(path.join(__dirname, "./mockSearch.html"), {
            encoding: "utf-8",
        }),
    };

    jest.mocked(axios.get).mockResolvedValue(response);

    const results = await search({ q: "The Martian" });

    fs.writeFileSync("test.json", JSON.stringify(results), {
        encoding: "utf-8",
    });

    expect(results).toMatchObject(expectedResults);
});
