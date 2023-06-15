import "./App.css";
import Table from "./components/Table/Table";
import { QueryClient, QueryClientProvider } from "react-query";
import { useTransactionGenerator } from "./hooks";

/// if the user goes over 100 they get a green icon, 500, yellow, 1000 oranage, higher than 1000 red

const App = () => {
  const queryClient = new QueryClient();

  const GeneratorWrapper = () => {
    const query = useTransactionGenerator({
      customers: 100,
      months: 3,
      onError: (error) => {
        console.error("there was a query", error);
      },
    });

    console.log("query", query);

    return (
      <div className="App">
        <header className="App-header" />
        <Table users={[]} />
      </div>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <GeneratorWrapper />
    </QueryClientProvider>
  );
};

export default App;
