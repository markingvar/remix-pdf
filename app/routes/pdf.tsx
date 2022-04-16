import { renderToStream } from "@react-pdf/renderer";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { LoaderFunction } from "@remix-run/node";

// Specify the path to the public fonts folder

// If we just try to specify the font using absolue paths:
// "../../public/fonts/fieldwork-800.woff2", Font.register
// looks for fonts from the build directory and throws an error.
// Think this has something to do with the current path on the server

// The path is wrong, so we need to provide the path to the
// /public/fonts folder
let projectPublicFontsPath = __dirname.replace("/build", "/public/fonts");

Font.register({
  family: "display",
  fonts: [
    {
      src: `${projectPublicFontsPath}/fieldwork-300.woff2`,
      fontWeight: 300,
    },
    {
      src: `${projectPublicFontsPath}/fieldwork-400.woff2`,
      fontWeight: 400,
    },
    {
      src: `${projectPublicFontsPath}/fieldwork-600.woff2`,
      fontWeight: 600,
    },
    {
      src: `${projectPublicFontsPath}/fieldwork-700.woff2`,
      fontWeight: 700,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 14,
    fontFamily: "display",
    fontWeight: 400,
    color: "#1C252C",
  },
  section: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  flexRow: {
    flexDirection: "row",
  },
  docTitle: {
    width: "100%",
    fontSize: 22,
    fontWeight: 700,
    color: "#0087CB",
  },
  sectionSpacer: {
    height: 28,
  },
  sectionTitle: {
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: 400,
    color: "#556370",
    marginBottom: 2,
  },
  neutral6: {
    color: "#556370",
  },
  neutral9: {
    color: "#1C252C",
  },
  contentWrapper: {
    minWidth: "44%",
  },
  textContainer: {
    flexDirection: "column",
  },
  semibold: {
    fontWeight: 600,
  },
  bold: {
    fontWeight: 700,
  },
  sm: {
    fontSize: 12,
  },
  lg: {
    fontSize: 16,
  },
  xl: {
    fontSize: 18,
  },
  mb: {
    marginBottom: 10,
  },
  mblg: {
    marginBottom: 14,
  },
  textField: {
    marginBottom: 4,
  },
});

// Create Document Component
function PDFDemo() {
  let orderId = sampleServiceOrderData?.orderId;
  console.log({
    sampleServiceOrderDataId: sampleServiceOrderData?.orderId ?? "no data",
  });

  while (orderId.length < 5) {
    orderId = "0" + orderId;
  }

  console.log({ orderId });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={[styles.docTitle, { minWidth: "46%" }]}>
            Service Order
          </Text>
          <Text style={[styles.neutral6, styles.sm]}>
            ID:
            <Text
              style={[styles.semibold, styles.lg, styles.neutral9]}
            >{`  MJ${orderId}`}</Text>
          </Text>
        </View>
        <View style={styles.sectionSpacer}></View>

        <View style={styles.flexRow}>
          <View style={styles.section}>
            <View style={styles.contentWrapper}>
              <Text style={styles.sectionTitle}>Client Details</Text>
              <View style={styles.textContainer}>
                {sampleServiceOrderData.clientDetails.map((client) => {
                  if (client.field === "Client Name") {
                    return (
                      <Text style={[styles.bold, styles.xl]} key={client.field}>
                        {client.value}
                      </Text>
                    );
                  } else if (
                    client.field === "Site Contact" &&
                    client.value.length >= 2
                  ) {
                    return (
                      <View>
                        <Text style={styles.semibold} key={client.field}>
                          {client.value}
                        </Text>
                      </View>
                    );
                  } else {
                    return <Text key={client.field}>{client.value}</Text>;
                  }
                })}
              </View>
            </View>
            {sampleServiceOrderData.billingDetails.length >= 1 && (
              <View>
                <Text style={styles.sectionTitle}>Billing Info</Text>
                {sampleServiceOrderData.billingDetails.map((billing) => {
                  if (billing.field === "Billing Method") {
                    return (
                      <Text
                        key={billing.field}
                        style={[styles.bold, styles.lg]}
                      >
                        {billing.value}
                      </Text>
                    );
                  } else {
                    return <Text key={billing.field}>{billing.value}</Text>;
                  }
                })}
              </View>
            )}
          </View>
        </View>
        <View style={styles.sectionSpacer}></View>

        <View style={styles.section}>
          <View style={[{ maxWidth: "78%" }]}>
            <Text style={styles.sectionTitle}>Work Performed</Text>
            <View style={{ paddingTop: 2 }} />
            {sampleServiceOrderData.workPerformed.map((work) => {
              if (sampleServiceOrderData.workPerformed.length > 1) {
                return (
                  <View style={[styles.mb]} key={work.date}>
                    <Text style={[styles.bold]}>{work.date}</Text>
                    <Text>{work.description}</Text>
                  </View>
                );
              } else {
                return (
                  <View key={work.date}>
                    {/* <Text style={styles.bold}>{work.field}</Text> */}
                    <Text>{work.description}</Text>
                  </View>
                );
              }
            })}
          </View>
        </View>
        <View style={styles.sectionSpacer}></View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parts Used</Text>
        </View>
      </Page>
    </Document>
  );
}

export let loader: LoaderFunction = async ({ request, params }) => {
  // you can get any data you need to generate the PDF inside the loader
  // however you want, e.g. fetch an API or query a DB or read the FS
  // let data = await getDataForThePDFSomehow({ request, params });

  // render the PDF as a stream so you do it async
  let stream = await renderToStream(<PDFDemo />);

  // and transform it to a Buffer to send in the Response
  let body: Buffer = await new Promise((resolve, reject) => {
    let buffers: Uint8Array[] = [];
    stream.on("data", (data) => {
      buffers.push(data);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
    stream.on("error", reject);
  });

  // finally create the Response with the correct Content-Type header for
  // a PDF
  let headers = new Headers({ "Content-Type": "application/pdf" });
  return new Response(body, { status: 200, headers });
};

const sampleServiceOrderData = {
  orderId: "1",
  clientDetails: [
    {
      field: "Client Name",
      value: "Roustabouts",
    },
    {
      field: "Address",
      value: "123 Main Street",
    },
    {
      field: "City",
      value: "Fort St John",
    },
    {
      field: "Site Contact",
      value: "John Doe",
    },
    {
      field: "Phone",
      value: "123-456-7890",
    },
  ],
  billingDetails: [
    {
      field: "Billing Method",
      value: "Email Invoice",
    },
    {
      field: "Billing Method Info",
      value: "joe@joe.com",
    },
  ],
  workPerformed: [
    {
      date: "Nov 15/22",
      description: `Responded to no heat call. Inducer motor faulty. Sourced and ordered new motor. Will return to install parts on arrival.`,
    },
    {
      date: "Nov 17/22",
      description:
        "Replaced combustion blower on arrival. Test ran furnace by cycling on/off multiple times and monitoring operation for 15+ minutes. All ok at time of test.",
    },
  ],
  partsUsed: [
    {
      field: "1-70-101087-81 Combustion Blower Motor",
      quantity: 1,
      source: "ISC",
    },
    {
      field: "16*25*1 Pleated Filter",
      quantity: 1,
      source: "Home Hardware",
    },
  ],
  labor: [
    { date: "Nov 15/21", hours: 1.5, technician: "Mark" },
    { date: "Nov 17/21", hours: 2, technician: "Mark" },
  ],
  shopSupplies: [
    { item: "Vacuum Pump Rental", quantity: 1 },
    { item: "Recovery Unit Rental", quantity: 1 },
    { item: "SilFos", quantity: 3 },
  ],
  otherCharges: [
    { item: "Freight", amount: "" },
    { item: "Mileage", amount: "246km" },
  ],
};
