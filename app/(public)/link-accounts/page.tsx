import LinkAccountsFlow from "../../components/form-flow/from-flow";

export const metadata = {
  title: 'Link Accounts',
  description: 'Link your bluesky and x accounts so people can find you'
}

export default async function LinkAccountsPage() {
  // Fetch poem server-side
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/poem`);
  const data = await response.json();
  const initialPoem = data.poem;

  return (
    <LinkAccountsFlow initialPoem={initialPoem} />
  );
}
