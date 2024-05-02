import { Box, Container, Stack, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import ButtonPrimary from '../styled/ButtonPrimary';
import MenuLinkSocialIcon from '../styled/MenuLinkSocialIcon';

export default function BottomBar() {
  const theme = useTheme();
  const bp = theme.breakpoints.values;
  const mq = (bp) => `@media (min-width: ${bp}px)`;
  return (
    <Box
      css={{
        backgroundColor: '#ddd',
        padding: '100px 0px',
        width: '100%',
      }}
    >
      <Container>
        <Grid2
          container
          justifyContent="center"
          alignItems="center"
          rowSpacing={3}
          columnSpacing={3}
          maxWidth={1440}
        >
          <Grid2
            xs={12}
            sm={4}
            css={{
              textAlign: 'left',
            }}
          >
            <a target="_blank" href="https://czodiac.com">
              <img
                src="https://czodiac.com/images/czodiac.png"
                alt="Czodiac.com"
                width={180}
                height={64}
              />
            </a>
          </Grid2>
          <Grid2
            xs={12}
            sm={8}
            css={{
              [mq(bp.xs)]: { textAlign: 'center' },
              [mq(bp.sm)]: { textAlign: 'right' },
            }}
          >
            <Stack
              direction="row"
              spacing={4}
              alignItems="center"
              justifyContent="flex-end"
            >
              <MenuLinkSocialIcon
                href="https://twitter.com/zodiacs_c"
                src="https://czodiac.com/images/icons/Twitter-Red.svg"
                alt="Twitter"
                width={30}
                height={25}
              />
              <MenuLinkSocialIcon
                href="https://t.me/CZodiacofficial"
                src="https://czodiac.com/images/icons/TG-Red.svg"
                alt="Telegram"
                width={27}
                height={23}
              />
              <MenuLinkSocialIcon
                href="https://czodiac.medium.com/"
                src="https://czodiac.com/images/icons/Medium-Red.svg"
                alt="Medium"
                width={30}
                height={25}
              />
              <MenuLinkSocialIcon
                href="https://github.com/chinese-zodiac"
                src="https://czodiac.com/images/icons/Github-Red.svg"
                alt="Github"
                width={30}
                height={25}
              />
              <MenuLinkSocialIcon
                href="https://discord.gg/Tg9JFQxzbs"
                src="https://czodiac.com/images/icons/Discord-Red.svg"
                alt="Discord"
                width={30}
                height={25}
              />
            </Stack>
          </Grid2>
          <Grid2 xs={12}>
            <h3>IMPORTANT: Do not expect profits from other's efforts.</h3>
            <p css={{ fontSize: 14, fontWeight: 400 }}>
              Nothing on this site or on related channels should be considered a
              promise by anyone, including but not limited to the developers and
              promoters of this site, to perform work to generate profits for
              anyone including but not limited to the following: the users of
              this site; CZodiac community members; CZF holders; CZR holders;
              CZUSD holders; or anyone using any of the sites, smart contracts,
              social media channels, and any other media or tech related to CZF,
              CZR and CZodiac or any of the community members. Czodiac, CZF,
              CZR, cz.farm, REWARDS.CZ.CASH, and related technologies plus media
              are all experimental and must be used according to your personal
              financial situation and risk profile. There are no guarantees of
              profits.
            </p>
          </Grid2>
          <Grid2 xs={12}>
            <h3>WARNING: You may incur a tax liability.</h3>
            <p css={{ fontSize: 14, fontWeight: 400 }}>
              Please consult your tax adviser before using REWARDS.CZ.CASH,
              CZodiac products, CZodiac tokens, other dapps linked by this site.
              Just like for every blockchain dapp, there may be complex taxation
              issues depending on your jurisdiction.
            </p>
          </Grid2>
          <Grid2 xs={12}>
            <h3>WARNING: You are using experimental technology.</h3>
            <p css={{ fontSize: 14, fontWeight: 400 }}>
              All CZodiac products are experimental technology which may fail in
              unexpected ways from causes such as hacks, tokenomic design,
              software errors, or other unexpected issues that can not be
              anticipated as with any other experimental technology. Do not
              trust CZodiac dapps or other products with more funds than you can
              afford to use. Use CZodiac at your own risk, just as you would
              with any other innovative blockchain dapp.
            </p>
          </Grid2>
          <Grid2 xs={12}>
            <h3>Legal Disclaimer</h3>
            <p css={{ fontSize: 14, fontWeight: 400 }}>
              All information provided by REWARDS.CZ.CASH and other CZodiac
              products, tokens, and dapps has no guarantee of completeness,
              accuracy, timeliness or of the results obtained from the use of
              information and/or CZodiac products, and without warranty of any
              kind, express or implied, including but not limited to warranties
              of performance, merchantability and fitness for a particular
              purpose. CZodiac and its members, team, developers, affiliates,
              associates, token holders, or other individuals or organizations
              involved in CZodiac products, dapps, or other services will not be
              liable to you or anyone else for any decision made or action taken
              in reliance on the information given by REWARDS.CZ.CASH or other
              CZodiac dapps or services for any consequential, special or
              similar damages, even if advised of the possibility of such
              damages.
            </p>
          </Grid2>
          <Grid2 xs={12}>
            <h3>Contact</h3>
            <p css={{ fontSize: 14, fontWeight: 400 }}>team@czodiac.com</p>
            <ButtonPrimary
              href="https://czodiac.gitbook.io/czodiac-litepaper/"
              css={{
                marginTop: '15px !important',
                backgroundColor: '#AF3532',
                fontSize: 16,
                borderRadius: 10,
                '&:hover': {
                  backgroundColor: '#c96a68',
                },
              }}
            >
              Whitepaper
            </ButtonPrimary>
          </Grid2>
          <Grid2 xs={12}>
            <p css={{ color: '#B0AAAA', fontSize: 14, fontWeight: 400 }}>
              © 2023 CZodiac. All rights reserved
            </p>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
