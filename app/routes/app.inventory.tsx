import { LoaderFunction, json } from "@remix-run/node";
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

        const  { admin, session } = await authenticate.admin(request);
      
        try {
          const response = await admin.rest.resources.InventoryLevel.all({
              session: session,
              location_ids: '69771100207'
          })
      
          if(response){
              console.log('hit')
      
              const data = response.data
      
              console.log(data, 'data')
      
              return json({
                  inventory: data
              })
      
          }
      
          return null
      
        } catch(err){
          console.log(err)
        }
        return null
      }


const Inventory = () => {
    const data: any = useLoaderData()
    console.log(data);
    
    return (<Page>
        <Layout>
            <Layout.Section>
                <Card>
                <List type="bullet" gap="loose">
                        {
                            data.inventory.map((item: any) => {
                                return (
                                    <List.Item key={item.location_id}>
                                        <h2>{item.available}</h2>
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

export default Inventory