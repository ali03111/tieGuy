import React, {memo, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  ImageBackground,
  Alert,
  Modal,
} from 'react-native';
import {TextComponent} from '../../Components/TextComponent';
import {styles} from './styles';
import ThemeButton from '../../Components/ThemeButton';
import {
  email,
  lock,
  userIcon,
  phone,
  logo,
  rememberImg,
  rememberEmpty,
  username,
  emailIcon,
  passwordIcon,
  company,
  google,
  facebook,
  apple,
  locksetting,
  sms,
  user,
} from '../../Assets';
import {InputComponent} from '../../Components/InputComponent';
import {Controller} from 'react-hook-form';
import {Touchable} from '../../Components/Touchable';
import useRegister from './useRegisterScreen';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import {LoginBg} from '../../Assets';
import {hp, wp} from '../../Config/responsive';
import SocialBottomComp from '../../Components/SocialBottomComp';
import {Colors, FontSize} from '../../Theme/Variables';
import CheckBox from 'react-native-checkbox';
import {termsUrl} from '../../Utils/Urls';

const RegisterScreen = ({navigation}) => {
  const {
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    goBack,
    loginNav,
    signUpButton,
    PolicyValue,
    policy,
    socialLoginFun,
  } = useRegister(navigation);
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  return (
    <ImageBackground source={LoginBg} style={styles.ImgBg}>
      <KeyBoardWrapper
        styles={styles.logInMain}
        showsVerticalScrollIndicator={false}>
        <View style={styles.loginBottom}>
          <View style={styles.loginTop}>
            <TextComponent text={'Sign Up'} styles={styles.signInText} />
          </View>
          <InputComponent
            {...{
              name: 'name',
              handleSubmit,
              errors,
              reset,
              control,
              getValues,
              placeholder: 'First Name',
              isImage: user,
              defaultValue: __DEV__ ? 'first' : '',
              handleSubmit,
              errors,
              reset,
              control,
              getValues,
              selectionColor: 'white',
            }}
          />
          <InputComponent
            {...{
              name: 'last_name',
              handleSubmit,
              errors,
              reset,
              control,
              getValues,
              placeholder: 'Last Name',
              defaultValue: __DEV__ ? 'last' : '',
              isImage: user,
              selectionColor: 'white',
            }}
          />

          <InputComponent
            {...{
              name: 'email',
              handleSubmit,
              errors,
              reset,
              control,
              getValues,
              placeholder: 'Email Address',
              isImage: sms,
              defaultValue: __DEV__ ? 'test@mailinator.com' : '',
              selectionColor: 'white',
            }}
          />
          <InputComponent
            {...{
              name: 'password',
              handleSubmit,
              errors,
              reset,
              control,
              getValues,
              placeholder: 'Password',
              isImage: locksetting,
              defaultValue: __DEV__ ? 'Test@123' : '',
              isSecure: true,
              inputIconStyle: styles.lockstyle,
              selectionColor: 'white',
            }}
          />
          <InputComponent
            {...{
              name: 'confirm_password',
              handleSubmit,
              errors,
              reset,
              control,
              getValues,
              placeholder: 'Confirm Password',
              isImage: locksetting,
              defaultValue: __DEV__ ? 'Test@123' : '',
              isSecure: true,
              inputIconStyle: styles.lockstyle,
              selectionColor: 'white',
            }}
          />
          <View style={styles.checkboxContainer}>
            <CheckBox
              label=""
              checked={isChecked}
              onChange={
                () => setShowModal(true) // Show EULA modal only if terms are not accepted
              }
              // onChange={() => setIsChecked(!isChecked)}
            />
            <Text style={styles.checkboxText}>
              I agree to the
              <TextComponent
                styles={styles.termsLink}
                onPress={() => Linking.openURL(termsUrl)}
                text={` Terms of Use (EULA)`}
              />
            </Text>
          </View>
          <View style={{paddingTop: hp('3')}}>
            <ThemeButton
              title={'Sign Up'}
              onPress={() => {
                if (isChecked) handleSubmit(signUpButton)();
                else Alert.alert('Please accept the terms and policy');
              }}
              style={styles.buttonStyle}
            />
          </View>
          <View style={styles.barMain}>
            <View style={styles.barLine}></View>
            <TextComponent text={'Or Sign Up with'} styles={styles.barText} />
            <View style={styles.barLine}></View>
          </View>
          <SocialBottomComp onSocialPress={socialLoginFun} />
          <View style={styles.dontHave}>
            <TextComponent
              text={'Already have an account?'}
              styles={styles.dontHaveText}
            />
            <Touchable onPress={loginNav}>
              <Text style={styles.signUpText}>Log In</Text>
            </Touchable>
          </View>
        </View>
        {/* Terms & Conditions Modal */}
        <Modal visible={showModal} animationType="slide" transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Legal Terms</Text>
              <ScrollView style={styles.modalContent}>
                <Text
                  style={{
                    fontSize: FontSize.scale16,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  Effective Date: June 03, 2026{'\n'}
                </Text>

                <Text style={{color: 'black'}}>
                  AGREEMENT TO OUR LEGAL TERMS{'\n\n'}
                </Text>

                <Text style={{color: 'black'}}>
                  We are Tie Guy ("Company," "we," "us," "our").{'\n'}
                  We operate, as well as any other related products and services
                  that refer or link to these legal terms (the "Legal Terms")
                  (collectively, the "Services"). You can contact us by email at
                  info@tieguy.com{'\n\n'}
                  These Legal Terms constitute a legally binding agreement made
                  between you, whether personally or on behalf of an entity
                  ("you"), and concerning your access to and use of the
                  Services. You agree that by accessing the Services, you have
                  read, understood, and agreed to be bound by all of these Legal
                  Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN
                  YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU
                  MUST DISCONTINUE USE IMMEDIATELY.{'\n\n'}
                  Supplemental terms and conditions or documents that may be
                  posted on the Services from time to time are hereby expressly
                  incorporated herein by reference. We reserve the right, in our
                  sole discretion, to make changes or modifications to these
                  Legal Terms at any time and for any reason. We will alert you
                  about any changes by updating the "Last updated" date of these
                  Legal Terms, and you waive any right to receive specific
                  notice of each such change. It is your responsibility to
                  periodically review these Legal Terms to stay informed of
                  updates. You will be subject to, and will be deemed to have
                  been made aware of and to have accepted, the changes in any
                  revised Legal Terms by your continued use of the Services
                  after the date such revised Legal Terms are posted.{'\n\n'}
                  We recommend that you print a copy of these Legal Terms for
                  your records.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  TABLE OF CONTENTS{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  1. OUR SERVICES{'\n'}
                  2. INTELLECTUAL PROPERTY RIGHTS{'\n'}
                  3. USER REPRESENTATIONS{'\n'}
                  4. PROHIBITED ACTIVITIES{'\n'}
                  5. USER GENERATED CONTRIBUTIONS{'\n'}
                  6. CONTRIBUTION LICENSE{'\n'}
                  7. SERVICES MANAGEMENT{'\n'}
                  8. TERM AND TERMINATION{'\n'}
                  9. MODIFICATIONS AND INTERRUPTIONS{'\n'}
                  10. GOVERNING LAW{'\n'}
                  11. DISPUTE RESOLUTION{'\n'}
                  12. CORRECTIONS{'\n'}
                  13. DISCLAIMER{'\n'}
                  14. LIMITATIONS OF LIABILITY{'\n'}
                  15. INDEMNIFICATION{'\n'}
                  16. USER DATA{'\n'}
                  17. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES
                  {'\n'}
                  18. MISCELLANEOUS{'\n'}
                  19. CONTACT US{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  1. OUR SERVICES{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  The information provided when using the Services is not
                  intended for distribution to or use by any person or entity in
                  any jurisdiction or country where such distribution or use
                  would be contrary to law or regulation or which would subject
                  us to any registration requirement within such jurisdiction or
                  country. Accordingly, those persons who choose to access the
                  Services from other locations do so on their own initiative
                  and are solely responsible for compliance with local laws, if
                  and to the extent local laws are applicable.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  2. INTELLECTUAL PROPERTY RIGHTS{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  Our intellectual property{'\n\n'}
                  We are the owner or the licensee of all intellectual property
                  rights in our Services, including all source code, databases,
                  functionality, software, website designs, audio, video, text,
                  photographs, and graphics in the Services (collectively, the
                  "Content"), as well as the trademarks, service marks, and
                  logos contained therein (the "Marks").{'\n\n'}
                  Our Content and Marks are protected by copyright and trademark
                  laws (and various other intellectual property rights and
                  unfair competition laws) and treaties in the United States and
                  around the world.{'\n\n'}
                  The Content and Marks are provided in or through the Services
                  "AS IS" for your personal, non-commercial use or internal
                  business purpose only.{'\n\n'}
                  Your use of our Services{'\n\n'}
                  Subject to your compliance with these Legal Terms, including
                  the "PROHIBITED ACTIVITIES" section below, we grant you a
                  non-exclusive, non-transferable, revocable license to:{'\n\n'}
                  • access the Services{'\n'}• download or print a copy of any
                  portion of the Content to which you have properly gained
                  access.{'\n\n'}
                  solely for your personal, non-commercial use or internal
                  business purpose.{'\n\n'}
                  Except as set out in this section or elsewhere in our Legal
                  Terms, no part of the Services and no Content or Marks may be
                  copied, reproduced, aggregated, republished, uploaded, posted,
                  publicly displayed, encoded, translated, transmitted,
                  distributed, sold, licensed, or otherwise exploited for any
                  commercial purpose whatsoever, without our express prior
                  written permission.{'\n\n'}
                  If you wish to make any use of the Services, Content, or Marks
                  other than as set out in this section or elsewhere in our
                  Legal Terms, please address your request to info@tieguy.com.
                  If we ever grant you the permission to post, reproduce, or
                  publicly display any part of our Services or Content, you must
                  identify us as the owners or licensors of the Services,
                  Content, or Marks and ensure that any copyright or proprietary
                  notice appears or is visible on posting, reproducing, or
                  displaying our Content.{'\n\n'}
                  We reserve all rights not expressly granted to you in and to
                  the Services, Content, and Marks.{'\n\n'}
                  Any breach of these Intellectual Property Rights will
                  constitute a material breach of our Legal Terms and your right
                  to use our Services will terminate immediately.{'\n\n'}
                  Your submissions{'\n\n'}
                  By directly sending us any question, comment, suggestion,
                  idea, feedback, or other information about the Services
                  ("Submissions"), you agree to assign to us all intellectual
                  property rights in such Submission. You agree that we shall
                  own this Submission and be entitled to its unrestricted use
                  and dissemination for any lawful purpose, commercial or
                  otherwise, without acknowledgment or compensation to you.
                  {'\n\n'}
                  You are responsible for what you post or upload: By sending us
                  Submissions through any part of the Services you:{'\n\n'}•
                  confirm that you have read and agree with our "PROHIBITED
                  ACTIVITIES" and will not post, send, publish, upload, or
                  transmit through the Services any Submission that is illegal,
                  harassing, hateful, harmful, defamatory, obscene, bullying,
                  abusive, discriminatory, threatening to any person or group,
                  sexually explicit, false, inaccurate, deceitful, or
                  misleading;{'\n'}• to the extent permissible by applicable
                  law, waive any and all moral rights to any such Submission;
                  {'\n'}• warrant that any such Submission are original to you
                  or that you have the necessary rights and licenses to submit
                  such Submissions and that you have full authority to grant us
                  the above-mentioned rights in relation to your Submissions;
                  and{'\n'}• warrant and represent that your Submissions do not
                  constitute confidential information.{'\n\n'}
                  You are solely responsible for your Submissions and you
                  expressly agree to reimburse us for any and all losses that we
                  may suffer because of your breach of (a) this section, (b) any
                  third party's intellectual property rights, or (c) applicable
                  law.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  3. USER REPRESENTATIONS{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  By using the Services, you represent and warrant that: (1) you
                  have the legal capacity and you agree to comply with these
                  Legal Terms; (2) you are not a minor in the jurisdiction in
                  which you reside; (3) you will not access the Services through
                  automated or non-human means, whether through a bot, script or
                  otherwise; (4) you will not use the Services for any illegal
                  or unauthorized purpose; and (5) your use of the Services will
                  not violate any applicable law or regulation.{'\n\n'}
                  If you provide any information that is untrue, inaccurate, not
                  current, or incomplete, we have the right to suspend or
                  terminate your account and refuse any and all current or
                  future use of the Services (or any portion thereof).{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  4. PROHIBITED ACTIVITIES{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  You may not access or use the Services for any purpose other
                  than that for which we make the Services available. The
                  Services may not be used in connection with any commercial
                  endeavors except those that are specifically endorsed or
                  approved by us.{'\n\n'}
                  As a user of the Services, you agree not to:{'\n\n'}•
                  Systematically retrieve data or other content from the
                  Services to create or compile, directly or indirectly, a
                  collection, compilation, database, or directory without
                  written permission from us{'\n'}• Trick, defraud, or mislead
                  us and other users, especially in any attempt to learn
                  sensitive account information such as user passwords.{'\n'}•
                  Circumvent, disable, or otherwise interfere with
                  security-related features of the Services, including features
                  that prevent or restrict the use or copying of any Content or
                  enforce limitations on the use of the Services and/or the
                  Content contained therein.{'\n'}• Disparage, tarnish, or
                  otherwise harm, in our opinion, us and/or the Services.{'\n'}•
                  Use any information obtained from the Services in order to
                  harass, abuse, or harm another person.{'\n'}• Make improper
                  use of our support services or submit false reports of abuse
                  or misconduct.{'\n'}• Use the Services in a manner
                  inconsistent with any applicable laws or regulations.{'\n'}•
                  Engage in unauthorized framing of or linking to the Services.
                  {'\n'}• Upload or transmit (or attempt to upload or to
                  transmit) viruses, Trojan horses, or other material, including
                  excessive use of capital letters and spamming (continuous
                  posting of repetitive text), that interferes with any party's
                  uninterrupted use and enjoyment of the Services or modifies,
                  impairs, disrupts, alters, or interferes with the use,
                  features, functions, operation, or maintenance of the
                  Services.{'\n'}• Engage in any automated use of the system,
                  such as using scripts to send comments or messages, or using
                  any data mining, robots, or similar data gathering and
                  extraction tools.{'\n'}• Delete the copyright or other
                  proprietary rights notice from any Content.{'\n'}• Attempt to
                  impersonate another user or person or use the username of
                  another user.{'\n'}• Upload or transmit (or attempt to upload
                  or to transmit) any material that acts as a passive or active
                  information collection or transmission mechanism, including
                  without limitation, clear graphics interchange formats
                  ("gifs"), 1x1 pixels, web bugs, cookies, or other similar
                  devices (sometimes referred to as "spyware" or "passive
                  collection mechanisms" or "pcms").{'\n'}• Interfere with,
                  disrupt, or create an undue burden on the Services or the
                  networks or services connected to the Services.{'\n'}• Harass,
                  annoy, intimidate, or threaten any of our employees or agents
                  engaged in providing any portion of the Services to you.{'\n'}
                  • Attempt to bypass any measures of the Services designed to
                  prevent or restrict access to the Services, or any portion of
                  the Services.{'\n'}• Copy or adapt the Services' software,
                  including but not limited to Flash, PHP, HTML, JavaScript, or
                  other code.{'\n'}• Except as permitted by applicable law,
                  decipher, decompile, disassemble, or reverse engineer any of
                  the software comprising or in any way making up a part of the
                  Services.{'\n'}• Except as may be the result of standard
                  search engine or Internet browser usage, use, launch, develop,
                  or distribute any automated system, including without
                  limitation, any spider, robot, cheat utility, scraper, or
                  offline reader that accesses the Services, or use or launch
                  any unauthorized script or other software.{'\n'}• Use a buying
                  agent or purchasing agent to make purchases on the Services.
                  {'\n'}• Make any unauthorized use of the Services, including
                  collecting usernames and/or email addresses of users by
                  electronic or other means for the purpose of sending
                  unsolicited email, or creating user accounts by automated
                  means or under false pretenses.{'\n'}• Use the Services as
                  part of any effort to compete with us or otherwise use the
                  Services and/or the Content for any revenue-generating
                  endeavor or commercial enterprise.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  5. USER GENERATED CONTRIBUTIONS{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  The Services does not offer users to submit or post content.
                  We may provide you with the opportunity to create, submit,
                  post, display, transmit, perform, publish, distribute, or
                  broadcast content and materials to us or on the Services,
                  including but not limited to text, writings, video, audio,
                  photographs, graphics, comments, suggestions, or personal
                  information or other material (collectively, "Contributions").
                  Contributions may be viewable by other users of the Services
                  and through third-party websites. When you create or make
                  available any Contributions, you thereby represent and warrant
                  that:{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  6. CONTRIBUTION LICENSE{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  You and Services agree that we may access, store, process, and
                  use any information and personal data that you provide and
                  your choices (including settings).{'\n\n'}
                  By submitting suggestions or other feedback regarding the
                  Services, you agree that we can use and share such feedback
                  for any purpose without compensation to you.{'\n\n'}
                  We do not assert any ownership over your Contributions. You
                  retain full ownership of all of your Contributions and any
                  intellectual property rights or other proprietary rights
                  associated with your Contributions. We are not liable for any
                  statements or representations in your Contributions provided
                  by you in any area on the Services. You are solely responsible
                  for your Contributions to the Services and you expressly agree
                  to exonerate us from any and all responsibility and to refrain
                  from any legal action against us regarding your Contributions.
                  {'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  7. SERVICES MANAGEMENT{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  We reserve the right, but not the obligation, to: (1) monitor
                  the Services for violations of these Legal Terms; (2) take
                  appropriate legal action against anyone who, in our sole
                  discretion, violates the law or these Legal Terms, including
                  without limitation, reporting such user to law enforcement
                  authorities; (3) in our sole discretion and without
                  limitation, refuse, restrict access to, limit the availability
                  of, or disable (to the extent technologically feasible) any of
                  your Contributions or any portion thereof; (4) in our sole
                  discretion and without limitation, notice, or liability, to
                  remove from the Services or otherwise disable all files and
                  content that are excessive in size or are in any way
                  burdensome to our systems; and (5) otherwise manage the
                  Services in a manner designed to protect our rights and
                  property and to facilitate the proper functioning of the
                  Services.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  8. TERM AND TERMINATION{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  These Legal Terms shall remain in full force and effect while
                  you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF
                  THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE
                  DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND
                  USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES),
                  TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING
                  WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY,
                  OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY
                  APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR
                  PARTICIPATION IN THE SERVICES OR DELETE ANY CONTENT OR
                  INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN
                  OUR SOLE DISCRETION.{'\n\n'}
                  If we terminate or suspend your account for any reason, you
                  are prohibited from registering and creating a new account
                  under your name, a fake or borrowed name, or the name of any
                  third party, even if you may be acting on behalf of the third
                  party. In addition to terminating or suspending your account,
                  we reserve the right to take appropriate legal action,
                  including without limitation pursuing civil, criminal, and
                  injunctive redress.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  9. MODIFICATIONS AND INTERRUPTIONS{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  We reserve the right to change, modify, or remove the contents
                  of the Services at any time or for any reason at our sole
                  discretion without notice. However, we have no obligation to
                  update any information on our Services. We will not be liable
                  to you or any third party for any modification, price change,
                  suspension, or discontinuance of the Services.{'\n\n'}
                  We cannot guarantee the Services will be available at all
                  times. We may experience hardware, software, or other problems
                  or need to perform maintenance related to the Services,
                  resulting in interruptions, delays, or errors. We reserve the
                  right to change, revise, update, suspend, discontinue, or
                  otherwise modify the Services at any time or for any reason
                  without notice to you. You agree that we have no liability
                  whatsoever for any loss, damage, or inconvenience caused by
                  your inability to access or use the Services during any
                  downtime or discontinuance of the Services. Nothing in these
                  Legal Terms will be construed to obligate us to maintain and
                  support the Services or to supply any corrections, updates, or
                  releases in connection therewith.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  10. GOVERNING LAW{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  These Legal Terms shall be governed by and defined following
                  the laws of the United States and yourself irrevocably consent
                  that the courts of the United States shall have exclusive
                  jurisdiction to resolve any dispute which may arise in
                  connection with these Legal Terms.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  11. DISPUTE RESOLUTION{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  Informal Negotiations{'\n\n'}
                  To expedite resolution and control the cost of any dispute,
                  controversy, or claim related to these Legal Terms (each a
                  "Dispute" and collectively, the "Disputes") brought by either
                  you or us (individually, a "Party" and collectively, the
                  "Parties"), the Parties agree to first attempt to negotiate
                  any Dispute (except those Disputes expressly provided below)
                  informally for at least 30 days before initiating arbitration.
                  Such informal negotiations commence upon written notice from
                  one Party to the other Party.{'\n\n'}
                  Binding Arbitration{'\n\n'}
                  Any dispute arising out of or in connection with these Legal
                  Terms, including any question regarding its existence,
                  validity, or termination, shall be referred to and finally
                  resolved by the International Commercial Arbitration Court
                  under the European Arbitration Chamber (Belgium, Brussels,
                  Avenue Louise, 146) according to the Rules of this ICAC,
                  which, as a result of referring to it, is considered as the
                  part of this clause. The number of arbitrators shall be two.
                  The seat, or legal place, or arbitration shall be the United
                  States. The language of the proceedings shall be English. The
                  governing law of these Legal Terms shall be the substantive
                  law of the United States.{'\n\n'}
                  Restrictions{'\n\n'}
                  The Parties agree that any arbitration shall be limited to the
                  Dispute between the Parties individually. To the full extent
                  permitted by law,{'\n\n'}• no arbitration shall be joined with
                  any other proceeding{'\n'}• there is no right or authority for
                  any Dispute to be arbitrated on a class-action basis or to
                  utilize class action procedures{'\n'}• there is no right or
                  authority for any Dispute to be brought in a purported
                  representative capacity on behalf of the general public or any
                  other persons.{'\n\n'}
                  Exceptions to Informal Negotiations and Arbitration{'\n\n'}
                  The Parties agree that the following Disputes are not subject
                  to the above provisions concerning informal negotiations
                  binding arbitration:{'\n\n'}• any Disputes seeking to enforce
                  or protect, or concerning the validity of, any of the
                  intellectual property rights of a Party;{'\n'}• any Dispute
                  related to, or arising from, allegations of theft, piracy,
                  invasion of privacy, or unauthorized use; and{'\n'}• any claim
                  for injunctive relief.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  12. CORRECTIONS{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  There may be information on the Services that contains
                  typographical errors, inaccuracies, or omissions, including
                  descriptions, pricing, availability, and various other
                  information. We reserve the right to correct any errors,
                  inaccuracies, or omissions and to change or update the
                  information on the Services at any time, without prior notice.
                  {'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  13. DISCLAIMER{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS.
                  YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE
                  RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL
                  WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE
                  SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION,
                  THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                  PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO
                  WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR
                  COMPLETENESS OF THE SERVICES' CONTENT OR THE CONTENT OF ANY
                  WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE
                  WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS,
                  MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2)
                  PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER,
                  RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, (3) ANY
                  UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY
                  AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION
                  STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF
                  TRANSMISSION TO OR FROM THE SERVICES, (5) ANY BUGS, VIRUSES,
                  TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR
                  THROUGH THE SERVICES BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS
                  OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR
                  DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF SERVICE
                  ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE
                  VIA THE WE DO NOT WARRANT, ENDORSE, GUA TEE, OR ASSUME
                  RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR
                  OFFERED BY A THIRD PARTY THROUGH THE SERVICES, ANY HYPERLINKED
                  WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY
                  BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A PARTY TO OR
                  IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION
                  BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR
                  SERVICES. AS WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH
                  ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST
                  JUDGMENT AND EXERCISE CAUTION WHERE APPROPRIATE.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  14. LIMITATIONS OF LIABILITY{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE
                  LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT,
                  CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE
                  DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR
                  OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF
                  WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                  NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR
                  LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF
                  THE FORM OF THE WILL AT ALL TIMES BE LIMITED TO THE LESSER OF
                  THE AMOUNT PAID, IF ANY, BY YOU TO US OR. CERTAIN US STATE
                  LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON
                  IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN
                  DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE
                  DISCLAIMERS ACTION, OR LIMITATIONS MAY NOT APPLY TO YOU, AND
                  YOU MAY HAVE ADDITIONAL RIGHTS.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  15. INDEMNIFICATION{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  You agree to defend, indemnify, and hold us harmless,
                  including our subsidiaries, affiliates, and all of our
                  respective officers, agents, partners, and employees, from and
                  against any loss, damage, liability, claim, or demand,
                  including reasonable attorneys' fees and expenses, made by any
                  third party due to or arising out of:{'\n\n'}• use of the
                  Services;{'\n'}• breach of these Legal Terms;{'\n'}• any
                  breach of your representations and warranties set forth in
                  these Legal Terms;{'\n'}• your violation of the rights of a
                  third party, including but not limited to intellectual
                  property rights; or{'\n'}• any overt harmful act toward any
                  other user of the Services with whom you connected via the
                  Services.{'\n\n'}
                  Notwithstanding the foregoing, we reserve the right, at your
                  expense, to assume the exclusive defense and control of any
                  matter for which you are required to indemnify us, and you
                  agree to cooperate, at your expense, with our defense of such
                  claims. We will use reasonable efforts to notify you of any
                  such claim, action, or proceeding that is subject to this
                  indemnification upon becoming aware of it.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  16. USER DATA{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  We will maintain certain data that you transmit to the
                  Services for the purpose of managing the performance of the
                  Services, as well as data relating to your use of the
                  Services. Although we perform regular routine backups of data,
                  you are solely responsible for all data that you transmit or
                  that relates to any activity you have undertaken using the
                  Services. You agree that we shall have no liability to you for
                  any loss or corruption of any such data, and you hereby waive
                  any right of action against us arising from any such loss or
                  corruption of such data.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  17. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES
                  {'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  Visiting the Services, sending us emails, and completing
                  online forms constitute electronic communications. You consent
                  to receive electronic communications, and you agree that all
                  agreements, notices, disclosures, and other communications we
                  provide to you electronically, via email and on the Services,
                  satisfy any legal requirement that such communication be in
                  writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES,
                  CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC
                  DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS
                  INITIATED OR COMPLETED BY US OR VIA THE SERVICES. You hereby
                  waive any rights or requirements under any statutes,
                  regulations, rules, ordinances, or other laws in any
                  jurisdiction which require an original signature or delivery
                  or retention of non-electronic records, or to payments or the
                  granting of credits by any means other than electronic means.
                  {'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  18. MISCELLANEOUS{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  These Legal Terms and any policies or operating rules posted
                  by us on the Services or in respect to the Services constitute
                  the entire agreement and understanding between you and us. Our
                  failure to exercise or enforce any right or provision of these
                  Legal Terms shall not operate as a waiver of such right or
                  provision. These Legal Terms operate to the fullest extent
                  permissible by law. We may assign any or all of our rights and
                  obligations to others at any time. We shall not be responsible
                  or liable for any loss, damage, delay, or failure to act
                  caused by any cause beyond our reasonable control. If any
                  provision or part of a provision of these Legal Terms is
                  determined to be unlawful, void, or unenforceable, that
                  provision or part of the provision is deemed severable from
                  these Legal Terms and does not affect the validity and
                  enforceability of any remaining provisions. There is no joint
                  venture, partnership, employment, or agency relationship
                  created between you and us as a result of these Legal Terms or
                  use of the Services. You agree that these Legal Terms will not
                  be construed against us by virtue of having drafted them. You
                  hereby waive any and all defenses you may have based on the
                  electronic form of these Legal Terms and the lack of signing
                  by the parties hereto to execute these Legal Terms.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  19. CONTACT US{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  In order to resolve a complaint regarding the Services or to
                  receive further information regarding the use of the Services,
                  please contact us at: info@tieguy.com{'\n\n'}
                  By using our Services, you agree to these Legal Terms.{'\n'}
                </Text>
              </ScrollView>

              {/* Modal Actions */}
              <View style={styles.modalButtons}>
                <ThemeButton
                  title="Decline"
                  onPress={() => {
                    setIsChecked(false);

                    setShowModal(false);
                  }}
                  textStyle={{
                    fontSize: FontSize.scale15,
                    fontFamily: 'Nunito-bold',
                  }}
                  style={{
                    ...styles.buttonStyle,
                    width: wp('40'),
                  }}
                />
                <ThemeButton
                  title="Accept & Proceed"
                  onPress={() => {
                    setIsChecked(true);
                    setShowModal(false);
                    // handleSubmit(signUpButton)();
                  }}
                  textStyle={{
                    fontSize: FontSize.scale15,
                    fontFamily: 'Nunito-bold',
                    color: Colors.white,
                  }}
                  style={{
                    ...styles.buttonStyle,
                    backgroundColor: Colors.primaryColor,
                    width: wp('40'),
                    marginLeft: wp('2'),
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </KeyBoardWrapper>
    </ImageBackground>
  );
};
export default memo(RegisterScreen);
