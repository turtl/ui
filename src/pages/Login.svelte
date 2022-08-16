<script>
    import Button from '../components/form/Button.svelte';
    import Input from '../components/form/Input.svelte';
    import log from '../util/log';

    function submit(e) {
        e.preventDefault();
        e.stopPropagation();
        log.info('SUBMIT: ', e);
    }
</script>

<form on:submit={submit}>
    <Input type="email" name="email" label="Email" required=true value="jerk@jerks.com" />
    <Input type="password" name="password" label="Passphrase" required=true />
    <Input type="textarea" name="body" label="Note" class="" value="get fucked"/>
    <div class="flex w-full">
        <Button on:click={submit} label="Login" icon="&#xF0C9;" />
        <Button on:click={submit} label="Login" />
        <Button on:click={submit} label="Hello" display="outlined" icon="&#xF0C9;" />
        <Button on:click={submit} label="Hello" display="outlined" />
        <Button on:click={submit} label="Omg" display="text" icon="&#xF0C9;" />
        <Button on:click={submit} label="Omg" display="text" />
    </div>
</form>

