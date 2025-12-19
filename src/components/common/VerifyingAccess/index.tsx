import Icon from "@lib/Common/Icon"


const VerifyingAccess = () => {
    return (
        <>
            <div>Verifying Access</div>
            <Icon name="loading" className="icon-wrapper w-14 h-14" />
            <p>please wait while we authenticate your credentials.</p>
        </>
    )
}
export default VerifyingAccess