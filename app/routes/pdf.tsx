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
import { ReactNode } from "react";

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
  neutral5: {
    color: "#556370",
  },
  neutral7: {
    color: "#35434E",
  },
  neutral9: {
    color: "#1C252C",
  },
  success: {
    color: "#00A179",
  },
  caution: {
    color: "#F4AB37",
  },
  whiteBg: {
    backgroundColor: "#FFF",
  },
  neutralBg: {
    backgroundColor: "#F2F4F6",
  },
  contentWrapper: {
    minWidth: "44%",
  },
  fullWidthContainer: {
    width: "96%",
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
  xxs: {
    fontSize: 11,
  },
  xs: {
    fontSize: 12,
  },
  sm: {
    fontSize: 13,
  },
  base: {
    fontSize: 14,
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

function LabelWrapper({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <Text style={[styles.neutral5, styles.xs, { textTransform: "uppercase" }]}>
      {label}
      {children}
    </Text>
  );
}

function TableLabel({
  children,
  style = [],
}: {
  children: ReactNode;
  style?: any;
}) {
  let normalizedStyles = [];

  if (style.length >= 1) {
    normalizedStyles.push(...style);
  } else {
    normalizedStyles.push(style);
  }

  let combinedStyles = [
    styles.neutral9,
    styles.xxs,
    styles.semibold,
    { textTransform: "uppercase" },
    ...normalizedStyles,
  ];

  return <Text style={combinedStyles}>{children}</Text>;
}

// Create Document Component
function PDFDemo() {
  let orderId = sampleServiceOrderData?.orderId;
  let jobStatus = sampleServiceOrderData?.jobStatus;
  console.log({
    sampleServiceOrderDataId: sampleServiceOrderData?.orderId ?? "no data",
  });

  while (orderId.length < 5) {
    orderId = "0" + orderId;
  }

  console.log({ orderId });

  return (
    <Document title={`Service Order MJ${orderId}`}>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={[styles.docTitle, { minWidth: "46%" }]}>
            Service Order
          </Text>
          <LabelWrapper label="ID:">
            <Text
              style={[
                styles.semibold,
                styles.lg,
                styles.neutral9,
                { textTransform: "capitalize" },
              ]}
            >{`  MJ${orderId}`}</Text>
          </LabelWrapper>

          <LabelWrapper label="Status:">
            <Text
              style={[
                styles.bold,
                styles.lg,
                styles.neutral9,
                { textTransform: "capitalize" },
                jobStatus === "Complete"
                  ? { ...styles.success }
                  : jobStatus === "Pending"
                  ? { ...styles.caution }
                  : { ...styles.neutral9 },
              ]}
            >
              {`  ${jobStatus}`}
            </Text>
          </LabelWrapper>
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
                  <View style={[styles.mb, styles.neutral7]} key={work.date}>
                    <Text style={[styles.bold]}>{work.date}</Text>
                    <Text style={styles.sm}>{work.description}</Text>
                  </View>
                );
              } else {
                return (
                  <View style={styles.mb} key={work.date}>
                    <Text style={styles.sm}>{work.description}</Text>
                  </View>
                );
              }
            })}
          </View>
        </View>
        <View style={styles.sectionSpacer}></View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
            Parts Used
          </Text>
          <View
            style={[
              styles.fullWidthContainer,
              {
                backgroundColor: "#DFE4E7",
                flexDirection: "row",
                padding: 6,
                paddingHorizontal: 10,
              },
            ]}
          >
            <TableLabel style={[{ minWidth: "32%" }]}>Part #</TableLabel>
            <TableLabel style={{ minWidth: "40%" }}>Description</TableLabel>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                minWidth: "6%",
              }}
            >
              <TableLabel>Qty</TableLabel>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                minWidth: "16%",
              }}
            >
              <TableLabel>Source</TableLabel>
            </View>
          </View>
          {sampleServiceOrderData.partsUsed.map((part, index) => {
            const isEven = index % 2 === 0;

            return (
              <View
                style={[
                  styles.fullWidthContainer,
                  {
                    flexDirection: "row",
                    padding: 6,
                    paddingHorizontal: 10,
                  },
                  isEven ? styles.whiteBg : styles.neutralBg,
                ]}
              >
                <TableField style={[{ minWidth: "32%" }]}>
                  {part.partNumber}
                </TableField>
                <TableField style={{ minWidth: "40%" }}>
                  {part.description}
                </TableField>
                <View
                  style={{
                    minWidth: "6%",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <TableField>{part.quantity}</TableField>
                </View>
                <View
                  style={{
                    minWidth: "16%",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <TableField>{part.source}</TableField>
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.sectionSpacer} />
        <View style={styles.section} wrap={false}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Labor</Text>
          <View
            style={[
              styles.fullWidthContainer,
              {
                backgroundColor: "#DFE4E7",
                flexDirection: "row",
                padding: 6,
                paddingHorizontal: 10,
              },
            ]}
          >
            <TableLabel style={[{ minWidth: "32%" }]}>Part #</TableLabel>
            <TableLabel style={{ minWidth: "40%" }}>Description</TableLabel>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                minWidth: "6%",
              }}
            >
              <TableLabel>Qty</TableLabel>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                minWidth: "16%",
              }}
            >
              <TableLabel>Source</TableLabel>
            </View>
          </View>
          {sampleServiceOrderData.partsUsed.map((part, index) => {
            const isEven = index % 2 === 0;

            return (
              <View
                style={[
                  styles.fullWidthContainer,
                  {
                    flexDirection: "row",
                    padding: 6,
                    paddingHorizontal: 10,
                  },
                  isEven ? styles.whiteBg : styles.neutralBg,
                ]}
              >
                <TableField style={[{ minWidth: "32%" }]}>
                  {part.partNumber}
                </TableField>
                <TableField style={{ minWidth: "40%" }}>
                  {part.description}
                </TableField>
                <View
                  style={{
                    minWidth: "6%",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <TableField>{part.quantity}</TableField>
                </View>
                <View
                  style={{
                    minWidth: "16%",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <TableField>{part.source}</TableField>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}

function TableField({
  children,
  style = [],
}: {
  children: ReactNode;
  style?: any;
}) {
  let normalizedStyles = [];

  if (style.length >= 1) {
    normalizedStyles.push(...style);
  } else {
    normalizedStyles.push(style);
  }

  let combinedStyles = [styles.neutral9, styles.xs, ...normalizedStyles];

  return <Text style={combinedStyles}>{children}</Text>;
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
  jobStatus: "Complete",
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
      partNumber: "1-70-101087-81",
      description: "Combustion Blower Motor",
      quantity: 1,
      source: "ISC",
    },
    {
      partNumber: "C-083S",
      description: "Filter/Drier",
      quantity: 1,
      source: "RSL",
    },
    {
      partNumber: "Not Available",
      description: "16*25*1 Pleated Filter",
      quantity: 2,
      source: "HH",
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
