import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, Layout, List, Page } from "@shopify/polaris";
import { apiVersion, authenticate } from "~/shopify.server";

const query = `
    {
        products(first: 10){
            edges{
                node{
                    id
                    handle
                    title
                    description
                }
            }
            pageInfo {
                hasNextPage
            }
        }
    }
    `

    
export const loader: LoaderFunction = async ({ request }) => {
    const {session} = await authenticate.admin(request);
    const {shop, accessToken} = session;

    try {
        const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/graphql",
                "X-Shopify-Access-Token": accessToken!
            },
            body: query

        });

        console.log(response);
        

        if(response.ok){
            const data = await response.json()

            const {
                data: {
                    products: { edges }  
                }
            } = data;
            return edges
        }
    } catch (error) {
        console.log(error);
        
    }
    return null
}



const Products = () => {
    const products: any = useLoaderData()
    return (<Page>
        <Layout>
            <Layout.Section>
                <Card>
                <List type="bullet" gap="loose">
                        {
                            products.map((edge: any) => {
                                const {node: products } = edge;
                                return (
                                    <List.Item key={products.id}>
                                        <h2>{products.title}</h2>
                                        <h2>{products.description}</h2>
                                    </List.Item>
                                )
                            })
                        }
    
                    </List>
                </Card>
            </Layout.Section>
        </Layout>
      </Page>);
}

export default Products