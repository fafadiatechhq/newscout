import Layout from '../Layout'

const PrivacyPolicyPageContainer = () => {
  const sections = [
    {
      title: 'Log Files',
      content: (
        <p className="mt-2 text-neutral-500 md:text-lg  md:font-medium  md:leading-8 leading-7">
          NewScout.com follows a standard procedure of using log files. These
          files log visitorswhen they visit websites. All hosting companies do
          this and a part of hosting services analytics. The information
          collected by log files include internet protocol (IP) addresses,
          browser type, Internet Service Provider (ISP), date and time stamp,
          referring/exit pages, and possibly the number of clicks. These are not
          linked to any information that is personally identifiable. The purpose
          of the information is for analyzing trends, administering the site,
          tracking user&apos;s movement on the website, and gathering
          demographic information.
        </p>
      ),
    },
    {
      title: 'Cookies and Web Beacons',
      content: (
        <p className="mt-2 text-neutral-500 md:text-lg  md:font-medium  md:leading-8 leading-7">
          Like any other website, NewScout.com uses &apos;cookies. These cookies
          are used to store information including visitors&apos; preferences,
          and the pages on the website that the visitor accessed or visited. The
          information is used to optimize the user&apos;s experience by
          customizing our web page content based on visitor&apos;s browser type
          and/or other information.
        </p>
      ),
    },
    {
      title: 'Privacy Policies',
      content: (
        <>
          <p className="mt-2 text-neutral-500 md:text-lg  md:font-medium  md:leading-8 leading-7">
            You may consult this list to find the Privacy Policy for each of the
            advertising partners of NewScout.com. Our Privacy Policy was
            created with the help of the <span>Privacy Policy Generator.</span>
          </p>
          <p className="mt-2 text-neutral-500 md:text-lg  md:font-medium  md:leading-8 leading-7">
            Third-party ad servers or ad networks uses technologies like
            cookies, JavaScript, or Web Beacons that are used in their
            respective advertisements and links that appear on NewScout.com,
            which are sent directly to user&apos;s browser. They automatically
            receive your IP address when this occurs. These technologies are
            used to measure the effectiveness of their advertising campaigns
            and/or to personalize the advertising content that you see on
            websites that you visit.
          </p>
          <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
            Note that NewScout.com has no access to or control over these
            cookies that are used by third-party advertisers.
          </p>
        </>
      ),
    },
    {
      title: 'Third Party Privacy Policies',
      content: (
        <>
          <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
            NewScout.com&apos;s Privacy Policy does not apply to other
            advertisers or websites. Thus, we are advising you to consult the
            respective Privacy Policies of these third-party ad servers for more
            detailed information. It may include their practices and
            instructions about how to opt-out of certain options. You may find a
            complete list of these Privacy Policies and their links here:
            Privacy Policy Links.
          </p>
          <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
            You can choose to disable cookies through your individual browser
            options. To know more detailed information about cookie management
            with specific web browsers, it can be found at the browser&apos;s
            respective websites. What Are Cookies?
          </p>
        </>
      ),
    },
    {
      title: "Children's Information",
      content: (
        <>
          <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
            Another part of our priority is adding protection for children while
            using the internet. We encourage parents and guardians to observe,
            participate in, and/or monitor and guide their online activity.
          </p>
          <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
            NewScout.in does not knowingly collect any Personal Identifiable
            Information from children under the age of 13. If you think that
            your child provided this kind of information on our website, we
            strongly encourage you to contact us immediately and we will do our
            best efforts to promptly remove such information from our records.
          </p>
        </>
      ),
    },
    {
      title: 'Online Privacy Policy Only',
      content: (
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
          This Privacy Policy applies only to our online activities and is valid
          for visitors to our website with regards to the information that they
          shared and/or collect in NewScout.com. This policy is not
          applicable to any information collected offline or via channels other
          than this website.
        </p>
      ),
    },
    {
      title: 'Consent',
      content: (
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
          By using our website, you hereby consent to our Privacy Policy and
          agree to its Terms and Conditions.
        </p>
      ),
    },
  ]
  return (
    <Layout>
      <div className=" max-w-[90%] md:px-8 md:max-w-7xl mx-auto my-12 box-border">
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
          At NewScout.in, accessible from <span>http://newscout.in</span>, one
          of our main priorities is the privacy of our visitors. This Privacy
          Policy document contains types of information that is collected and
          recorded by NewScout.com and how we use it.
        </p>
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium leading-7">
          If you have additional questions or require more information about our
          Privacy Policy, do not hesitate to contact us through email at
          customercare@newscout.com
        </p>
        {sections.map((section, index) => (
          <div
            className="mt-8 bg-card rounded-xl shadow shadow-gray md:text-3xl font-semibold  p-5"
            key={index}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-primary">
              {section.title}
            </h2>
            <div className="mt-2 h-1 w-20 bg-accent"></div>
            {section.content}
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default PrivacyPolicyPageContainer
