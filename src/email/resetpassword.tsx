import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
  } from '@react-email/components';
  
  interface ResetPasswordEmailProps {
    username: string;
    otp: string;
    
  }
  
  export default function ResetPasswordEmail({ username, otp }: ResetPasswordEmailProps) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Verification Code To Reset Password</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Here's your verification code: {otp}</Preview>
        <Section>
          <Row>
            <Heading as="h2">Hello {username},</Heading>
          </Row>
          <Row>
            <Text>
              We received a request to reset your password. Please use the following verification code to reset your password:
            </Text>
          </Row>
          <Row>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', margin: '20px 0' }}>{otp}</Text>
          </Row>
          <Row>
            Smartxcode -------- Follow
          </Row>
          <Row>
            <Text style={{ marginTop: '20px' }}>
              If you did not request this code, please ignore this email. Your password will remain unchanged.
            </Text>
          </Row>
        </Section>
      </Html>
    );
  }
  