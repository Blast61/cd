<h1>Client Data</h1>

<h2>Running/Starting the Application</h2>

<ul>Open a new terminal and run the following commands
  <li> `npm install` </li>
    <li> This will install all the dependencies needed for the project to open and run successfully on your local machine </li>
  <li> `npm run dev` </li>
    <li> As explicitly stated in the package.json there is a script to open the project, the specific script command is "dev" paired with the `npm run` </li>
  <li> Upon running the command, the build tool vite should expose a new terminal at port 5173 and launch the application in a new web browser</li>
</ul>

<h3>How does it all work? 😸</h3>

<ul> The project is built with the following tech stack
  <li> JS/TS </li>
  <li> React.js </li>
  <li> Vite </li>
  <li> Papa Parse </li>
</ul>

<h3> Approach <h3>

<p> In favor of development effeciency and to adhere to the time allotted for this assignment I utilized Vite's lightning fast building/compiling capabilities to quickly open and expose a built in port to host my webpage.

-The `CsvFetcher.tsx` component is responsible for fetching the data from the CSV file and parsing it into an array of objects containing the data fetched from the CSV file. Within the component are several methods for interacting with the data.

- `parseDate` takes in a string containing the date as its lone argument and proceeds to convert it to a `new Date()` string ordered by a `${year}-${month}-${day}` template.
- `sortedData` takes in the parsed `results` data and calls the built in JS method `.sort()`. The `dateA` & `dateB` variables are assigned the evaluated result of invoking `parseDate` and passing in the specific `eventDate` and invoking the built in JS method `.getTime()` which returns a number that represents the difference between the current time in milliseconds and (a very long time ago😂) Jan. 1 1970, using this number I created a check to ensure that the data was sorted in reverse chronological order per the instructions.

-`groupedData` is the evaluated result of invoking the groupBy() callback located in the `utils` folder, taking in a callback itself in `sortedData` and an annonymous function that returns all data with a combination of firstName and lastName.

-`groupBy` is a common function used to group similar data by taking in a keyFunction that maps each item of type `D` to a key of type `K`
-The reduce method iterates over the `data` array storing groups in an object with all unique keys from the keyFunction, each key's value is an array of `items`. The reduce method is initialized with an empty object and its result is an object with unique keys with values containing arrays of items grouped by the keys. -`const group = groups[key] || []` This line checks if there is already a group for the key in the `groups` object and if not it creates a new empty array, then pushing the current item into the group. The gropus object gets updated with each element from the `data` array.

-`reducedData` is the evaluated result of invoking Object.values on the groupedData and mapping across the array of values and reducing them based on the most recent event sorting by invoking a `new Date()` and passing in the current and previous array element's eventDate property. Using a turnary operator to ensure the most recent one is returned.

-`clientDuplicates` is the evaluated result of invoking the reducedData callback and mapping across the array of `reducedData` and assigning a boolean `hasDuplicates` property to each element, `hasDuplicates` invokes the `groupBy` callback passing in the already `sortedData` and checking to see if the current `row` has any duplicates based on the criteria of having matching first/last names. This will later impact the rendering of the table ensuring that duplicate clients will not render unless the (+) button is clicked.

-The useEffect hook is rounded out by invoking the setter function and passing in the `clientDuplicates` variable, paired with two forms of error handling, the first being in case the parsing of the CSV data failed at any point, this boundary would log an error message letting me know that there might be an issue with the papa parser. My second form of error handling occurs with the `catch` block that is required when implementing asynchronous `try` blocks. It is finished with a final invokation of the `fetchCsvData()` function that instatiates the data fetching.

-`toggleRow` takes in a `nameKey` string argument and invokes the `setCsvData` setter function and maps across the data array ensuring that the current data being iterated over is being checked to see if the row should be toggled or not. If the condition is true, it means the current row matches the one that needs to be toggled, creating a new object with the `...row` spread operator then toggled with the `!row.expanded`. If the condition is false the row is unchanged. The mapping function returns a new array with the updated rows and updates the state for csvData by passing it into the setter function `setCsvData` which triggers a re-render of the component with the updated state.

-`tableHeaders` contains an array of strings with a revamped and more professionally appealing look to use as a table headers. Initially the table utilized the data from the `csvData` as table headers but they were all in camel casing and did not seem to "fit-in", which I took the liberty of changing to standard/conventional casing.

-The component returns JSX containing a table that is filled with the csvData fetched by the component and is conditionally rendered based on the instructions provided and the current state of the data. Each cell filled with data is assigned its own unique index based key to satisfy React's requirement of all elements containing a unique identifier so when re-rendering occurs React knows under the hood which components/elements changed from the previous render. </p>
